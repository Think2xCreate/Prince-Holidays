import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type CameraMotionMode = 'dolly-into-bus' | 'cabin-window-glide' | 'horizon-departure';

export interface VideoScrubberOptions {
  /** Unique identifier for this video section so only the active section seeks */
  id: string;
  /** The HTMLVideoElement to scrub */
  video: HTMLVideoElement;
  /** Optional fallback element (e.g., poster image/container) to animate smoothly when video is unavailable or seeking is unsupported */
  fallbackElement?: HTMLElement | null;
  /** Optional depth layer (e.g., sun-flare / window reflection / foreground mist) driven in 3D space */
  atmosphereElement?: HTMLElement | null;
  /** Camera motion profile for realistic 3D scroll dolly */
  cameraMode?: CameraMotionMode;
  /** Interpolation factor (0.05 - 0.35). Higher = tighter tracking */
  lerpFactor?: number;
  /** Minimum time delta (in seconds) required to trigger a video.currentTime assignment */
  minSeekDelta?: number;
  /** Callback when media readiness or fallback state changes */
  onStateChange?: (state: { isVideoReady: boolean; usingFallback: boolean; progress: number }) => void;
}

export interface VideoScrubberController {
  /** Update normalized scroll progress (0 to 1) from ScrollTrigger */
  setProgress: (progress: number) => void;
  /** Mark whether this video section is currently in or near the active viewport */
  setActive: (active: boolean) => void;
  /** Trigger lazy loading of the video source when approaching viewport */
  loadVideo: () => void;
  /** Refresh measurements and duration state */
  refresh: () => void;
  /** Clean up all listeners, ticker callbacks, and observers */
  destroy: () => void;
}

/** Controller handle exposed to non-React consumers (batched by reference, no re-renders) */
export type VideoScrubberHandle = VideoScrubberController;

// Track currently active scrubbing section so multiple sections don't compete for decoding simultaneously
let activeScrubberId: string | null = null;

/**
 * Shared Scroll-Controlled Video & 3D Camera Dolly Engine
 *
 * Synchronizes video frame seeking AND multi-plane 3D camera dolly motion in both
 * scroll-down (forward into the bus / through the cabin window) and scroll-up (reverse) directions.
 */
export function createVideoScrubber(options: VideoScrubberOptions): VideoScrubberController {
  let destroyed = false;
  let isVideoReady = false;
  // Last applied transform strings — skip DOM writes when the value did not
  // change so idle ticks cost nothing (previously every tick rewrote styles).
  let lastFallbackTransform = '';
  let lastAtmosphereTransform = '';
  let lastAtmosphereOpacity = '';

  const {
    id,
    video,
    fallbackElement,
    atmosphereElement,
    cameraMode = 'dolly-into-bus',
    lerpFactor = 0.14,
    minSeekDelta = 0.025,
    onStateChange,
  } = options;

  let smoothedProgress = 0;
  let targetProgress = 0;
  let lastSeekTime = -1;
  let duration = 0;
  let usingFallback = true;
  let isSectionActive = false;
  let hasStartedLoading = false;
  let isSeeking = false;
  let seekResetTimer: ReturnType<typeof setTimeout> | null = null;

  const notifyState = () => {
    onStateChange?.({
      isVideoReady,
      usingFallback,
      progress: smoothedProgress,
    });
  };

  // Cached write: identical transforms skip the DOM so idle ticks cost nothing.
  const setFallbackTransform = (transform: string, origin: string) => {
    if (transform !== lastFallbackTransform && fallbackElement) {
      fallbackElement.style.transformOrigin = origin;
      fallbackElement.style.transform = transform;
      lastFallbackTransform = transform;
    }
  };

  const applyCameraMotion = (p: number) => {
    if (!fallbackElement) return;

    // Velocity-based subtle motion blur & optical depth
    const velocity = Math.abs(targetProgress - p);
    if (cameraMode === 'dolly-into-bus') {
      const easeInOut = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const aggressive = Math.pow(p, 0.82);
      const scale = 1.04 + easeInOut * 0.55 + aggressive * 0.14;
      const xPercent = -2.2 + easeInOut * 4.6 + aggressive * 2.0;
      const yPercent = 3.6 - easeInOut * 6.4 - aggressive * 1.4;
      const rotX = (0.5 - p) * 1.6;
      const rotZ = (0.5 - p) * -0.5;
      setFallbackTransform(
        `perspective(1200px) translate3d(${xPercent.toFixed(3)}%, ${yPercent.toFixed(3)}%, 0) scale(${scale.toFixed(4)}) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`,
        '54% 52%'
      );
    } else if (cameraMode === 'cabin-window-glide') {
      const scale = 1.08 + p * 0.28;
      const xPercent = 3.5 - p * 7.0;
      const yPercent = 2.5 - p * 5.0;
      setFallbackTransform(
        `perspective(1200px) translate3d(${xPercent.toFixed(3)}%, ${yPercent.toFixed(3)}%, 0) scale(${scale.toFixed(4)})`,
        '50% 50%'
      );
    } else {
      const scale = 1.24 - p * 0.18;
      const yPercent = -3.0 + p * 6.0;
      setFallbackTransform(
        `perspective(1200px) translate3d(0%, ${yPercent.toFixed(3)}%, 0) scale(${scale.toFixed(4)})`,
        '50% 55%'
      );
    }

    if (atmosphereElement) {
      // Golden sunlight flare & glass reflection sweeping across the coach window as you scroll
      const flareX = -25 + p * 55;
      const flareY = -10 + p * 20;
      const flareOpacity = 0.25 + Math.sin(p * Math.PI) * 0.35 + Math.min(velocity * 2, 0.15);
      const at = `translate3d(${flareX.toFixed(2)}%, ${flareY.toFixed(2)}%, 0) scale(${(1.05 + p * 0.2).toFixed(3)})`;
      const ao = flareOpacity.toFixed(3);
      if (at !== lastAtmosphereTransform) {
        atmosphereElement.style.transform = at;
        lastAtmosphereTransform = at;
      }
      if (ao !== lastAtmosphereOpacity) {
        atmosphereElement.style.opacity = ao;
        lastAtmosphereOpacity = ao;
      }
    }
  };

  const updateDuration = () => {
    if (
      video &&
      Number.isFinite(video.duration) &&
      video.duration > 0 &&
      video.readyState >= 1
    ) {
      duration = video.duration;
      isVideoReady = true;
      usingFallback = false;
      if (!video.paused) {
        video.pause();
      }
      notifyState();
    }
  };

  const handleError = () => {
    isVideoReady = false;
    usingFallback = true;
    notifyState();
  };

  const handleSeeked = () => {
    isSeeking = false;
    if (seekResetTimer) {
      clearTimeout(seekResetTimer);
      seekResetTimer = null;
    }
  };

  const onTick = () => {
    if (destroyed) return;
    if (document.hidden) return;
    if (!isSectionActive && activeScrubberId !== id) {
      return;
    }

    const diff = targetProgress - smoothedProgress;
    if (Math.abs(diff) > 0.0003) {
      smoothedProgress += diff * lerpFactor;
    } else if (smoothedProgress !== targetProgress) {
      smoothedProgress = targetProgress;
    } else if (
      (isVideoReady && duration > 0) ||
      (!atmosphereElement && lastFallbackTransform !== '')
    ) {
      // Fully settled: video needs no seeks and the cached transform needs no rewrite.
      return;
    }

    applyCameraMotion(smoothedProgress);

    if (!isVideoReady || duration <= 0) {
      return;
    }

    if (activeScrubberId !== id) {
      // Another section has claimed control of seeking; pause seeking but keep animating the
      // 3D camera fallback so the visible poster still tracks scroll in the meantime.
      return;
    }

    if (!video.paused) {
      video.pause();
    }

    const clampedProgress = Math.max(0, Math.min(0.998, smoothedProgress));
    const desiredTime = clampedProgress * duration;

    if (Math.abs(desiredTime - lastSeekTime) < minSeekDelta) {
      return;
    }

    if (isSeeking) {
      return;
    }

    try {
      isSeeking = true;
      lastSeekTime = desiredTime;

      const anyVideo = video as HTMLVideoElement & {
        fastSeek?: (time: number) => void;
      };

      if (typeof anyVideo.fastSeek === 'function') {
        anyVideo.fastSeek(desiredTime);
      } else {
        video.currentTime = desiredTime;
      }

      if (seekResetTimer) clearTimeout(seekResetTimer);
      seekResetTimer = setTimeout(() => {
        isSeeking = false;
      }, 140);
    } catch {
      isSeeking = false;
      usingFallback = true;
      notifyState();
    }
  };

  const loadVideo = () => {
    if (hasStartedLoading || !video) return;
    hasStartedLoading = true;

    const dataSrc = video.getAttribute('data-src');
    if (dataSrc && !video.getAttribute('src')) {
      video.src = dataSrc;
    }

    if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
      updateDuration();
    } else {
      try {
        video.load();
      } catch {
        usingFallback = true;
        notifyState();
      }
    }

    // If the browser supports it, nudge the video a few frames forward so the first scroll
    // interaction does not need to wait for a full metadata round-trip before scrubbing.
    if (video.readyState >= 2 && Number.isFinite(video.duration) && video.duration > 0) {
      const earlyTarget = Math.min(0.35, 0.05 * video.duration);
      if (Math.abs(video.currentTime - earlyTarget) > 0.25) {
        try {
          const anyVideo = video as HTMLVideoElement & { fastSeek?: (time: number) => void };
          if (typeof anyVideo.fastSeek === 'function') {
            anyVideo.fastSeek(earlyTarget);
          } else {
            video.currentTime = earlyTarget;
          }
        } catch {
          /* non-fatal seek nudge */
        }
      }
    }
  };

  const setProgress = (progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));
    if (clamped !== targetProgress) {
      targetProgress = clamped;
      if (isSectionActive) {
        activeScrubberId = id;
      }
    } else if (isSectionActive) {
      // Keep the active-scrubber identity stable even when the value has not changed,
      // so a quick scroll reversal does not hand control back to a stale section.
      activeScrubberId = id;
    }
  };

  const setActive = (active: boolean) => {
    isSectionActive = active;
    if (active) {
      activeScrubberId = id;
      loadVideo();
    } else if (activeScrubberId === id) {
      activeScrubberId = null;
    }
  };

  const refresh = () => {
    isSeeking = false;
    updateDuration();
    applyCameraMotion(smoothedProgress);
  };

  video.addEventListener('loadedmetadata', updateDuration);
  video.addEventListener('canplay', updateDuration);
  video.addEventListener('error', handleError);
  video.addEventListener('seeked', handleSeeked);
  gsap.ticker.add(onTick);
  applyCameraMotion(0);

  const destroy = () => {
    destroyed = true;
    gsap.ticker.remove(onTick);
    if (seekResetTimer) {
      clearTimeout(seekResetTimer);
      seekResetTimer = null;
    }
    video.removeEventListener('loadedmetadata', updateDuration);
    video.removeEventListener('canplay', updateDuration);
    video.removeEventListener('error', handleError);
    video.removeEventListener('seeked', handleSeeked);
    if (activeScrubberId === id) {
      activeScrubberId = null;
    }
  };

  return {
    setProgress,
    setActive,
    loadVideo,
    refresh,
    destroy,
  };
}
