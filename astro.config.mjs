// @ts-check

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Cloudflare Worker `manttio-website` (static assets). Swap for the custom
	// domain when one is attached — canonical URLs and the sitemap read this.
	site: 'https://manttio-website.dasom-mx.workers.dev',
	integrations: [sitemap(), icon()],
	vite: {
		plugins: [tailwindcss()],
	},
	// One family, four weights (typeset skill: a single family in multiple
	// weights beats pairing two sans-serifs that are similar but not identical).
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Figtree',
			cssVariable: '--font-figtree',
			weights: ['400 700'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
	],
});
