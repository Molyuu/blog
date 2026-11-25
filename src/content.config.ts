import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

// 「最近在做什么」: one file per update, named YYYY-MM.md, containing a Markdown list.
// The newest is shown on the home page; /now/ lists them all.
const now = defineCollection({
	loader: glob({ base: './src/content/now', pattern: '*.md' }),
});

export const collections = { blog, now };
