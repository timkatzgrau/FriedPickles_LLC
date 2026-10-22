import { mkdtemp, mkdir, copyFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const staging = await mkdtemp(path.join(tmpdir(), 'friedpickles-llc-deploy-'));

try {
  // Publish only the current site's public files; exclude legacy artifacts and OS metadata.
  const files = ['index.html', 'privacy.html', 'terms.html', 'sms.html', '404.html', 'robots.txt', 'sitemap.xml', 'assets/css/company.css', 'assets/js/site.js'];
  for (const directory of ['assets/brand', 'assets/fonts', 'assets/social']) {
    for (const entry of await readdir(path.join(root, 'docs', directory), { withFileTypes: true })) {
      if (entry.isFile() && !entry.name.startsWith('.')) files.push(path.join(directory, entry.name));
    }
  }
  for (const file of files) {
    await mkdir(path.dirname(path.join(staging, file)), { recursive: true });
    await copyFile(path.join(root, 'docs', file), path.join(staging, file));
  }
  const deployment = spawnSync('wrangler', [
    'pages', 'deploy', staging,
    '--project-name', 'friedpickles-llc',
    '--branch', 'master',
    '--commit-dirty=true',
    '--commit-message', 'Redesign company site with ChillMaps, RepairSeeker, finder backlinks and social previews',
  ], { cwd: root, stdio: 'inherit', env: { ...process.env, CI: 'true', CLOUDFLARE_ACCOUNT_ID: '38323c0280b0110946dba81170fd66d3', WRANGLER_SEND_METRICS: 'false' } });
  if (deployment.error) throw deployment.error;
  process.exitCode = deployment.status ?? 1;
} finally {
  await rm(staging, { recursive: true, force: true });
}
