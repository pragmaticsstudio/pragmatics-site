import { defineCollection, z } from "astro:content";

const page = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		source: z.string(),
	}),
});

export const collections = {
	caseStudies: page,
	posts: page,
};