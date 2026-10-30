// Verifies that every root-relative href, src, srcset and poster in dist/*.html
// points at a file that exists in dist/. Run after `astro build` (npm run check).
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
if (!existsSync(dist)) {
	console.error("dist/ not found. Run `astro build` first (or use `npm run check`).");
	process.exit(2);
}

function* walk(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) yield* walk(path);
		else if (name.endsWith(".html")) yield path;
	}
}

function exists(ref) {
	const clean = ref.split("#")[0].split("?")[0];
	let path;
	try {
		path = decodeURIComponent(clean);
	} catch {
		path = clean;
	}
	const target = join(dist, path);
	if (path.endsWith("/")) return existsSync(join(target, "index.html"));
	if (!existsSync(target)) return false;
	return statSync(target).isDirectory() ? existsSync(join(target, "index.html")) : true;
}

function refsIn(html) {
	const refs = [];
	for (const match of html.matchAll(/\s(href|src|srcset|poster)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
		const value = match[2] ?? match[3];
		const parts = match[1].toLowerCase() === "srcset" ? value.split(",").map((s) => s.trim().split(/\s+/)[0]) : [value];
		for (const part of parts) refs.push(part.trim());
	}
	return refs.filter((r) => r.startsWith("/") && !r.startsWith("//"));
}

const broken = [];
for (const file of walk(dist)) {
	const page = "/" + relative(dist, file).replace(/index\.html$/, "");
	const seen = new Set();
	for (const ref of refsIn(readFileSync(file, "utf8"))) {
		if (seen.has(ref)) continue;
		seen.add(ref);
		if (!exists(ref)) broken.push([page, ref]);
	}
}

for (const [page, ref] of broken) console.log(`${page} → ${ref}`);
console.log(`\n${broken.length} broken reference${broken.length === 1 ? "" : "s"}`);
process.exit(broken.length ? 1 : 0);
