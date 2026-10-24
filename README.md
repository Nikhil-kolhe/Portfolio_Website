# Nikhil Kolhe — Portfolio

Static React + TypeScript + Vite site. No backend, no secrets, ₹0 hosting.

## Run locally
    npm install
    npm run dev          # http://localhost:5173
    npm run build        # type-check + production build into dist/

## Design
Dark navy + electric-blue "AI lab" theme: glass cards, glass-slab pipeline section.
- Colours, fonts and spacing tokens are at the top of `src/styles.css` (`:root`).
- Fonts (Hanken Grotesk, JetBrains Mono, Barlow Condensed) are bundled via `@fontsource`, so no Google Fonts request is made.
- The hero cards live in `Stage()` and the pipeline steps in the `steps` array, both in `src/App.tsx`.
- There is no custom cursor; nothing on the page follows the mouse pointer.
- Contact form: set `email` in `profile.ts` and it opens the visitor's email app with the message filled in. For true no-click sending, create a free Formspree form and paste its URL into `formEndpoint`.
- Experience: each role has `gained` (what you learned) and `projects` (slugs from `projects.ts`); clicking a project opens its story.

## Edit content
- `src/data/profile.ts` — name, links (LinkedIn, email), experience, skills, certifications/research, resume path.
- `src/data/projects.ts` — projects and case studies. Empty fields show a yellow "To be added" marker.
- Resume: put your PDF at `public/assets/resume.pdf`, then set `resumeAvailable: true` in `profile.ts`.
- Canonical/OG URL: replace `YOUR-SITE.pages.dev` in `index.html` after first deploy.

## Deploy free on Cloudflare Pages
1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Framework preset: Vite (or set manually). Build command: `npm run build`. Output directory: `dist`.
4. Save and deploy. You get `https://<project>.pages.dev`; every push to the main branch redeploys automatically.

Single-page site with in-page anchors; no redirect rules needed on any static host.
Free plan limits: unlimited static bandwidth, 500 builds/month. No credit card needed.
