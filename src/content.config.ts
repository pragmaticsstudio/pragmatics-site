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

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
	schema,
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