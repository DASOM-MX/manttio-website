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
	// Dos familias: Instrument Sans para los titulares de página (h1 y los h2 de
	// sección) y Archivo para todo lo demás — subtítulos, títulos de tarjeta,
	// cuerpo, UI y cifras.
	//
	// Es variable con eje 200–700, así que los titulares recuperan el peso 600
	// que el diseño ya tenía (Alata, probada antes, solo existe en 400 y obligaba
	// a bajarlos). `font-synthesis` sigue apagado en global.css: el eje cubre el
	// rango de verdad y nadie tiene por qué sintetizar nada.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Instrument Sans',
			cssVariable: '--font-instrument',
			weights: ['400 700'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
		{
			// Solo `normal`: no hay una sola cursiva en el sitio, y la cara itálica
			// de Archivo pesa lo mismo que la recta.
			provider: fontProviders.google(),
			name: 'Archivo',
			cssVariable: '--font-archivo',
			weights: ['100 900'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
	],
});
