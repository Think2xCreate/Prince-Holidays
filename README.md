# Prince Holidays

Next.js travel website for Prince Holidays — bus tours, college trips, family holidays, and luxury tourist bus travel arrangements.

## Tech stack

- Next.js 15 (App Router), React 19
- Tailwind CSS v4
- GSAP + Lenis (smooth scroll & scroll-scrubbed video)
- Lucide React icons

## Project structure

```
src/app/            # Next.js App Router (layout, page)
src/components/     # Navbar, Footer, UI primitives, sections
src/data/           # Business config, destinations, travel categories, gallery data
src/lib/            # GSAP scroll helpers, video scrubber, utils
public/images/      # Static images (public asset paths used throughout)
```

## Run locally

**Prerequisites:** Node.js (LTS recommended)

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app runs at `http://localhost:3000`.

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | TypeScript type check |

## Notes

- All images are served from `public/images/` and referenced via `/images/...` paths in `src/data/business.ts`.
- Scroll animations use GSAP ScrollTrigger; Lenis smooth-scrolling is disabled on touch devices.
- The production build prerenders static routes (`/` and `/_not-found`).

## License

Private project.
