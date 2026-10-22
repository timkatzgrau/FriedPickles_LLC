import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'docs');
const pages = ['index.html', 'privacy.html', 'terms.html', 'sms.html', '404.html'];
const partials = new Map(await Promise.all(['header', 'footer'].map(async (name) => [
  name, (await readFile(path.join(root, 'partials', `${name}.html`), 'utf8')).trim(),
])));

await mkdir(output, { recursive: true });
for (const page of pages) {
  let html = await readFile(path.join(root, page), 'utf8');
  for (const [name, partial] of partials) {
    const marker = new RegExp(`<!-- inject:partials/${name}\\.html -->[\\s\\S]*?<!-- endinject -->`);
    if (!marker.test(html)) throw new Error(`Missing ${name} marker in ${page}`);
    html = html.replace(marker, `<!-- inject:partials/${name}.html -->\n${partial}\n  <!-- endinject -->`);
  }
  if (page === '404.html') html = html.replaceAll('src="assets/', 'src="/assets/');
  // Keep the root pages usable directly, as well as the existing docs/ publish folder.
  await writeFile(path.join(root, page), html);
  await writeFile(path.join(output, page), html);
}

async function copyAsset(relative) {
  const destination = path.join(output, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(root, relative), destination);
}
for (const relative of ['assets/css/company.css', 'assets/js/site.js', 'robots.txt', 'sitemap.xml']) {
  await copyAsset(relative);
}
for (const folder of ['assets/brand', 'assets/fonts', 'assets/social']) {
  for (const entry of await readdir(path.join(root, folder), { withFileTypes: true })) {
    if (entry.isFile() && !entry.name.startsWith('.')) await copyAsset(path.join(folder, entry.name));
  }
}
console.log(`Built ${pages.length} pages and their assets into docs/.`);
