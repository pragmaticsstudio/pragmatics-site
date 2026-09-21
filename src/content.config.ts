import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
	title: z.string(),
	description: z.string().optional(),
});

const pageSchema = schema.extend({
	route: z.string(),
});

const caseStudies = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/caseStudies" }),
	schema,
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