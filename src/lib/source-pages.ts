import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.join(process.cwd(), "src/content/source");

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
				const route = relative.replace(/\.html$/, "").replace(/\/index$/, "");
				if (!paths.has(route) || relative.endsWith("/index.html")) paths.set(route, relative);
			}
		}
	};
	visit(sourceRoot);
	return [...paths.values()];
}

const clean = (html: string) => {
	let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
	body = body.replace(/<script\b[\s\S]*?<\/script>/gi, "");
	body = body.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "");
	body = body.replace(/<form\b[\s\S]*?<\/form>/gi, "");
	body = body.replace(/<div[^>]*class="[^"]*?(?:cursor-wrapper|global-styles)[^"]*?"[^>]*>[\s\S]*?<\/div>/gi, "");
	body = body.replace(/<header\b[\s\S]*?<\/header>/gi, "");
	body = body.replace(/<footer\b[\s\S]*?<\/footer>/gi, "");
	body = body.replace(/\sdata-(?:wf|w-id|is-ix2-target|animation|duration|easing|delay|object-fit|autoplay|loop|direction|renderer|loading|nav-menu-open|current)="[^"]*"/gi, "");
	body = body.replace(/https?:\/\/cdn\.prod\.website-files\.com\/([^"'\s)]+)/g, (_, asset) => {
		const decoded = decodeURIComponent(asset).replace(/\/+/g, "/");
		const parts = decoded.split("/");
		const bucket = parts.shift();
		return `/webflow/images/${bucket}/${parts.join("/")}`;
	});
	body = body.replace(/(?:\.\.\/)+cdn\.prod\.website-files\.com\//g, "/webflow/images/");
	body = body.replace(/(?:\.\.\/)+d3e54v103j8qbb\.cloudfront\.net\//g, "/webflow/cloudfront/");
	body = body.replace(/href="(?:index|[\w-]+)\.html"/g, 'href="/"');
	body = body.replace(/href="(?:\.\.\/)+([^"#]+)\.html"/g, 'href="/$1/"');
	body = body.replace(/href="([^"#]+)\.html"/g, 'href="/$1/"');
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
	return { title, description, body: clean(source) };
}