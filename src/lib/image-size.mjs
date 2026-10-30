// Reads the pixel size of a PNG, JPEG, GIF or WebP under public/ so <img> tags can
// carry width and height and the page doesn't jump while images load.
import { openSync, readSync, closeSync, existsSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");

export function imageSize(src) {
	if (!src || !src.startsWith("/")) return undefined;
	const file = join(publicDir, decodeURIComponent(src.split(/[?#]/)[0]));
	if (!existsSync(file)) return undefined;
	const fd = openSync(file, "r");
	try {
		const head = Buffer.alloc(32);
		readSync(fd, head, 0, 32, 0);
		if (head.toString("latin1", 1, 4) === "PNG") {
			return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
		}
		if (head.toString("latin1", 0, 3) === "GIF") {
			return { width: head.readUInt16LE(6), height: head.readUInt16LE(8) };
		}
		if (head.toString("latin1", 0, 4) === "RIFF" && head.toString("latin1", 8, 12) === "WEBP") {
			const kind = head.toString("latin1", 12, 16);
			if (kind === "VP8X") return { width: 1 + head.readUIntLE(24, 3), height: 1 + head.readUIntLE(27, 3) };
			if (kind === "VP8 ") return { width: head.readUInt16LE(26) & 0x3fff, height: head.readUInt16LE(28) & 0x3fff };
			if (kind === "VP8L") {
				const bits = head.readUInt32LE(21);
				return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
			}
		}
		if (head[0] === 0xff && head[1] === 0xd8) {
			const buf = Buffer.alloc(65536);
			const n = readSync(fd, buf, 0, buf.length, 0);
			let i = 2;
			while (i + 9 < n) {
				if (buf[i] !== 0xff) { i++; continue; }
				const marker = buf[i + 1];
				if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
					return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
				}
				i += 2 + buf.readUInt16BE(i + 2);
			}
		}
	} finally {
		closeSync(fd);
	}
	return undefined;
}

// Adds width, height and lazy loading to the <img> tags in rendered markdown HTML.
export function addImageSizes(html) {
	return html.replace(/<img\s[^>]*>/g, (tag) => {
		const src = tag.match(/\ssrc="([^"]*)"/)?.[1];
		const size = src && imageSize(src);
		const attrs = size ? ` width="${size.width}" height="${size.height}"` : "";
		return tag.replace(/\s*\/?>$/, `${attrs} loading="lazy">`);
	});
}
