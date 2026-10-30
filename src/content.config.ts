import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
	title: z.string(),
	description: z.string().optional(),
});

const link = z.object({ label: z.string(), href: z.string() });

const pageSchema = schema.extend({
	route: z.string(),
	// Pages authored as clean markdown + components (new pattern). Legacy pages
	// keep raw Webflow HTML in the body and render via <Content /> as before.
	clean: z.boolean().optional(),
	// Looping muted clip beside the hero text (path without extension; .mp4 and .webm must exist).
	heroVideo: z.string().optional(),
	// Homepage sections. Projects and news are built from the collections.
	clients: z.object({ label: z.string(), logos: z.array(z.object({ name: z.string(), src: z.string() })), link: link }).optional(),
	services: z.object({ label: z.string(), items: z.array(z.object({ title: z.string(), text: z.string(), icon: z.string(), href: z.string(), linkLabel: z.string() })) }).optional(),
	projects: z.object({ heading: z.string(), button: link }).optional(),
	learn: z.object({ heading: z.string(), image: z.string(), lead: z.string(), items: z.array(z.object({ label: z.string(), text: z.string() })), link: link }).optional(),
	experiments: z.object({ heading: z.string(), intro: z.string(), lead: z.string(), items: z.array(z.object({ title: z.string(), image: z.string(), text: z.string(), link: link })) }).optional(),
	about: z.object({ heading: z.string(), paragraphs: z.array(z.string()), button: link }).optional(),
	news: z.object({ heading: z.string(), button: link }).optional(),
	// Services page: one row per offer.
	offers: z.array(z.object({ id: z.string(), title: z.string(), taglines: z.array(z.string()), headline: z.string(), intro: z.string(), items: z.array(z.string()), outro: z.string(), image: z.string() })).optional(),
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
	// Position in the Work list (1 first). Lowest first.
	order: z.number().optional(),
	// Shown on the homepage, in featuredOrder (lowest first).
	featured: z.boolean().optional(),
	featuredOrder: z.number().optional(),
	tags: z.array(z.string()).optional(),
	// Image for the cards when there is no cover (for example the page keeps its own images).
	cardImage: z.string().optional(),
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
	// Position in the lists (1 first) when no date is set.
	order: z.number().optional(),
	tag: z.string().optional(),
	// Large card at the top of the blog index.
	featured: z.boolean().optional(),
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