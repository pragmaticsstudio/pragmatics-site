import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
	title: z.string(),
	description: z.string().optional(),
});

const pageSchema = schema.extend({
	route: z.string(),
	// Pages authored as clean markdown + components (new pattern). Legacy pages
	// keep raw Webflow HTML in the body and render via <Content /> as before.
	clean: z.boolean().optional(),
	// Looping muted clip beside the hero text (path without extension; .mp4 and .webm must exist).
	heroVideo: z.string().optional(),
	hero: z
		.object({
			eyebrow: z.string().optional(),
			heading: z.string(),
			subheading: z.string().optional(),
		})
		.optional(),
});

const caseStudySchema = schema.extend({
	clean: z.boolean().optional(),
	subheading: z.string().optional(),
	client: z.string().optional(),
	year: z.string().optional(),
	timeline: z.string().optional(),
	website: z.string().optional(),
	// Image 0 from public/images/case-studies/<slug>/: shown on cards and at the top of the page.
	cover: z.string().optional(),
	coverAlt: z.string().optional(),
	// Images 1..n, in the order they appear on the page.
	gallery: z
		.array(
			z.object({
				src: z.string(),
				alt: z.string().optional(),
			}),
		)
		.optional(),
});

const caseStudies = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/caseStudies" }),
	schema: caseStudySchema,
});

const postSchema = schema.extend({
	// Only set when the post text gives a real publish date.
	date: z.coerce.date().optional(),
	author: z.string().optional(),
	image: z.string().optional(),
	imageAlt: z.string().optional(),
});

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
	schema: postSchema,
});

const pages = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
	schema: pageSchema,
});

export const collections = {
	caseStudies,
	posts,
	pages,
};