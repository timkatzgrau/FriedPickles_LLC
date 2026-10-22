import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(project, process.argv.includes('--docs') ? 'docs' : '.');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const pages = new Set(['index.html', 'privacy.html', 'terms.html', 'sms.html', 'robots.txt', 'sitemap.xml']);

http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    if (/^\/(privacy|terms|sms)\/?$/.test(pathname)) pathname = pathname.replace(/\/$/, '') + '.html';
    const relative = pathname.replace(/^\/+/, '');
    const file = path.resolve(root, relative);
    const isPublicAsset = /^assets\/(brand|fonts|social)\/[^/]+$/.test(relative) || ['assets/css/company.css', 'assets/js/site.js'].includes(relative);
    if (!file.startsWith(root + path.sep) || (!pages.has(relative) && !isPublicAsset) || !(await stat(file)).isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Page not found');
      return;
    }
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Content-Length': content.length, 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    const status = error instanceof URIError ? 400 : 404;
    response.writeHead(status, { 'Content-Type': 'text/plain' }).end(status === 400 ? 'Invalid URL' : 'Page not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Company site: http://localhost:${port}${root.endsWith('/docs') ? ' (docs build)' : ''}`));
