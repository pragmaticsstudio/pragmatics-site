import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.join(process.cwd(), "src/content/source");
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

function removeElement(html: string, tagName: string, className: string): string {
	const opening = new RegExp(`<${tagName}\\b[^>]*class="[^"]*${className}[^\"]*"[^>]*>`, "i");
	let result = html;
	let match: RegExpExecArray | null;
	while ((match = opening.exec(result))) {
		const start = match.index;
		const token = /<\/?[a-z][^>]*>/gi;
		token.lastIndex = start + match[0].length;
		let depth = 1;
		let tokenMatch: RegExpExecArray | null;
		while ((tokenMatch = token.exec(result))) {
			if (new RegExp(`^<${tagName}\\b`, "i").test(tokenMatch[0])) depth++;
			if (new RegExp(`^<\\/${tagName}>`, "i").test(tokenMatch[0]) && --depth === 0) {
				result = result.slice(0, start) + result.slice(token.lastIndex);
				break;
			}
		}
		if (depth !== 0) break;
	}
	return result;
}

export function getSourcePaths(): string[] {
	const paths = new Map<string, string>();
	const visit = (directory: string) => {
		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			const absolute = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				if (entry.name !== "fr-ca") visit(absolute);
				continue;
			}
			if (entry.name.endsWith(".html") && !absolute.includes(`${path.sep}fr-ca${path.sep}`)) {
				const relative = path.relative(sourceRoot, absolute);
				if (relative === "book-a-call.html") continue;
				const route = relative.replace(/\.html$/, "").replace(/\/index$/, "");
				if (!paths.has(route) || relative.endsWith("/index.html")) paths.set(route, relative);
			}
		}
	};
	visit(sourceRoot);
	return [...paths.values()];
}

const clean = (html: string, relativePath: string) => {
	let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
	body = body.replace(/<header\b[\s\S]*<\/header>/i, "");
	body = body.replace(/<footer\b[\s\S]*<\/footer>/i, "");
	body = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? body;
	body = body.replace(/<script\b[\s\S]*?<\/script>/gi, "");
	body = body.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "");
	body = body.replace(/<form\b[\s\S]*?<\/form>/gi, "");
	body = body.replace(/<a\b[^>]*href="(?:\.\.\/)?(?:contact|book-a-call)(?:\/index)?\.html"[^>]*>[\s\S]*?<\/a>/gi, "");
	body = body.replace(/<a\b[^>]*>[\s\S]*?(?:Start a project|Get in touch|Contact us|Book a Call|Book a call)[\s\S]*?<\/a>/gi, "");
	body = body.replace(/<section\b[^>]*class="[^"]*section-cta-contact[^"]*"[^>]*>[\s\S]*?<\/section>/i, "");
	if (relativePath === "contact.html" || relativePath === "book-a-call.html") {
		body = body.replace(/<section\b[^>]*class="[^"]*section-contact-offices[^"]*"[^>]*>[\s\S]*?<\/section>/i, "");
	}
	body = body.replace(/<div[^>]*class="[^"]*?(?:cursor-wrapper|global-styles)[^"]*?"[^>]*>[\s\S]*?<\/div>/gi, "");
	body = body.replace(/\sdata-(?:wf|w-id|is-ix2-target|animation|duration|easing|delay|object-fit|autoplay|loop|direction|renderer|loading|nav-menu-open|current)="[^"]*"/gi, "");
	body = body.replace(/https?:\/\/cdn\.prod\.website-files\.com\/([^"'\s,)]+)/g, (_, asset) => {
		const decoded = decodeURIComponent(asset).replace(/\/+/g, "/");
		const parts = decoded.split("/");
		const bucket = parts.shift();
		return `${baseUrl}/webflow/images/${bucket}/${parts.join("/")}`;
	});
	body = body.replace(/(?:\.\.\/)+cdn.prod.website-files.com\//g, `${baseUrl}/webflow/images/`);
	body = body.replace(/(?:\.\.\/)+d3e54v103j8qbb\.cloudfront\.net\//g, `${baseUrl}/webflow/cloudfront/`);
	body = body.replace(/href="(?:index|[\w-]+)\.html"/g, `href="${baseUrl}/"`);
	body = body.replace(/href="(?:\.\.\/)+([^"#]+)\.html"/g, `href="${baseUrl}/$1/"`);
	body = body.replace(/href="([^"#]+)\.html"/g, `href="${baseUrl}/$1/"`);
	return body;
};

export interface SourcePage {
	title: string;
	description?: string;
	body: string;
}

export function getSourcePage(relativePath: string): SourcePage {
	const source = fs.readFileSync(path.join(sourceRoot, relativePath), "utf8");
	const title = source.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "Pragmatics Studio";
	const description = source.match(/name="description" content="([^"]*)"/i)?.[1];
	return { title, description, body: clean(source, relativePath) };
}