import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const staticRoot = path.join(root, 'static');
const output = path.join(staticRoot, 'images/responsive');
const manifestPath = path.join(root, 'src/lib/generated/post-images.json');
const sources = new Set(['/images/editorial-backend-desk.jpg']);
for (const name of await fs.readdir(path.join(root, 'content/posts'))) {
  if (!/\.mdx?$/.test(name)) continue;
  const { data } = matter(await fs.readFile(path.join(root, 'content/posts', name), 'utf8'));
  for (const value of [data.cover, data.thumbnail]) {
    if (typeof value === 'string' && value.startsWith('/images/') && /\.(png|jpe?g|webp|avif)$/i.test(value)) sources.add(value);
  }
}
await fs.mkdir(output, { recursive: true });
const manifest = {};
for (const src of [...sources].sort()) {
  const original = path.resolve(staticRoot, `.${src}`);
  if (!original.startsWith(`${staticRoot}${path.sep}`)) continue;
  const bytes = await fs.readFile(original);
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const image = sharp(bytes).rotate();
  const meta = await image.metadata();
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.height;
  if (!width || !height) continue;
  const sizes = [...new Set([400, 800, 1200, 1800].map(size => Math.min(size, width)))];
  const variants = [];
  for (const size of sizes) {
    const filename = `${hash}-${size}.webp`;
    const file = path.join(output, filename);
    try { await fs.access(file); }
    catch { await image.clone().resize({ width: size, withoutEnlargement: true }).webp({ quality: 82 }).toFile(file); }
    variants.push(`/images/responsive/${filename} ${size}w`);
  }
  manifest[src] = { width, height, srcset: variants.join(', ') };
}
await fs.mkdir(path.dirname(manifestPath), { recursive: true });
const json = `${JSON.stringify(manifest, null, 2)}\n`;
let current = '';
try { current = await fs.readFile(manifestPath, 'utf8'); } catch { /* First generation. */ }
if (json !== current) await fs.writeFile(manifestPath, json);
console.log(`Responsive images ready: ${Object.keys(manifest).length} originals.`);
