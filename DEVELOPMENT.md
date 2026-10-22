# Fried Pickles LLC website

The company site for ChillMaps, RepairSeeker, and FriedPickles.com. Plain HTML, CSS, and JavaScript with a dependency-free Node build and local server.

## Work locally

Use Node.js 18 or later. No package installation is needed for these commands.

```sh
npm run build
npm run dev
```

Open http://localhost:4173. Set `PORT` to use a different port. The server binds only to localhost and serves only public website files.

## Publishing

`npm run build` updates the shared header and footer in the root HTML pages and copies the site to the existing `docs/` publish folder. `npm run preview` serves that output locally. `npm run deploy` publishes a clean copy of these public files to the existing Cloudflare Pages project `friedpickles-llc`, production branch `master`, using the already authenticated Wrangler CLI. It excludes legacy assets and OS metadata. The verified deployment tool is Wrangler 4.25.0. Running the build alone does not publish anything. A direct upload does not push local source changes to GitHub.

Edit `partials/header.html` and `partials/footer.html` for shared navigation, then rebuild. The legacy Bootstrap/Sass/Gulp assets are not used by the redesigned pages; use the npm commands above for this site.

## Content and assets

- ChillMaps descriptions and links were checked against its public website on September 28, 2026. Its wordmark and app artwork come from the existing ChillMaps sales assets.
- RepairSeeker descriptions, wordmark, and device image come from the local RepairSeeker project. Its public URL is https://repairseeker.com.
- Mona Sans is self-hosted under its included SIL Open Font License.
- Privacy and terms retain their original October 31, 2025 policy text and effective date. Only their surrounding layout and branding context were changed. SMS instructions retain the existing optional opt-in and STOP behavior.
- Existing user deletions and unrelated files were left alone. `index.html` and `docs/index.html` are rebuilt as the requested new homepage.

## SEO and sharing

- Each public page has its own title, description, canonical URL, Open Graph metadata, and Twitter large-image card. Canonical URLs use the extensionless paths served by Cloudflare Pages.
- Four branded 1200 × 630 PNG previews live in `assets/social/`. Their editable HTML template and page copy are in `scripts/social-preview.html` and `scripts/social-pages.json`.
- The homepage has Organization/Brand and WebSite JSON-LD. `robots.txt` references `sitemap.xml`.
- Every original external product and guide destination is preserved. Homepage and footer finder links are standard HTML anchors, with no `nofollow`, `sponsored`, or JavaScript-only navigation.
- A dedicated `404.html` prevents unknown URLs from returning the homepage with a success status on Cloudflare Pages.
