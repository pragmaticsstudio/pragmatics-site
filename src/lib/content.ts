import { getCollection } from "astro:content";

export async function getPage(route: string) {
	const page = (await getCollection("pages")).find((entry) => entry.data.route === route);
	if (!page) throw new Error(`Page content is missing: "${route}"`);
	return page;
}

/** Every case study, in the order of the Work page (`order`, lowest first). */
export async function getWork() {
	const all = await getCollection("caseStudies");
	return all.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
}

/** The case studies marked `featured: true`, in `featuredOrder`. */
export async function getFeaturedWork() {
	const all = await getCollection("caseStudies");
	return all
		.filter((entry) => entry.data.featured)
		.sort((a, b) => (a.data.featuredOrder ?? 999) - (b.data.featuredOrder ?? 999));
}

/** Every post: newest first when both have a `date`, otherwise by `order`. */
export async function getPosts() {
	const all = await getCollection("posts");
	return all.sort((a, b) => {
		if (a.data.date && b.data.date) return b.data.date.getTime() - a.data.date.getTime();
		return (a.data.order ?? 999) - (b.data.order ?? 999);
	});
}
