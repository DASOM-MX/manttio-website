# manttio-website

Marketing site for Manttio, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Project structure

```text
public/              Static assets served as-is
src/
  components/        BaseHead, Header, Footer, HeaderLink
  layouts/Layout.astro   Shared page shell (head + header + footer)
  pages/             File-based routes
  styles/global.css  Tailwind entry point and theme tokens
astro.config.mjs     Site config, sitemap, Tailwind plugin, fonts
```

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start the dev server at `localhost:4321`      |
| `npm run build`   | Build the production site to `./dist/`        |
| `npm run preview` | Preview the build locally                     |

## Styling

Tailwind CSS v4 is wired through the `@tailwindcss/vite` plugin — there is no
`tailwind.config.js`. Theme tokens live in the `@theme` block of
`src/styles/global.css`.

Fonts are served by Astro's font pipeline (`fonts` in `astro.config.mjs`):

- **DM Sans** — body text, available as `font-sans`
- **Figtree** — headings and accents, available as `font-display`

## Before going live

Set the real domain in `astro.config.mjs` (`site` is still `https://example.com`)
so canonical URLs and the sitemap are correct, and replace the Astro favicons in
`public/`.
