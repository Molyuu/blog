// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.molyuu.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		// The design uses plain monochrome code blocks (docs/redesign/post.html).
		syntaxHighlight: false,
	},
	fonts: [
		{
			// Chinese text uses the system Songti stack; only the monospace font is loaded.
			provider: fontProviders.google(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-mono',
			weights: [400, 700],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
});
