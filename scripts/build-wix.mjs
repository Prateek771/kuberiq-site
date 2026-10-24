import { cp, mkdir, readFile, readdir, rm, writeFile, lstat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { securityHeaders } from '../security-headers.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const built = join(root, 'dist');
const output = join(root, 'dist-wix');
const pageNames = ['index.html', 'voice-agents.html', 'automations.html', 'contact.html', 'privacy.html', 'terms.html'];
const pages = Object.fromEntries(await Promise.all(pageNames.map(async name => [`/${name}`, await readFile(join(built, name), 'utf8')])));

// Resolve and validate the exact generated-output directory before clearing it.
if (dirname(output) !== root || (await lstat(output).catch(error => {
  if (error.code === 'ENOENT') return null;
  throw error;
}))?.isSymbolicLink()) throw new Error('Unsafe Wix build output path');
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'client'), { recursive: true });
await mkdir(join(output, 'server'), { recursive: true });
for (const entry of await readdir(built)) {
  // HTML must reach the worker, not bypass it through static asset precedence.
  if (pageNames.includes(entry) || entry === '_headers') continue;
  await cp(join(built, entry), join(output, 'client', entry), { recursive: true });
}
await cp(join(root, 'deployment', 'wix-worker.mjs'), join(output, 'server', 'handler.mjs'));
await writeFile(join(output, 'server', 'index.mjs'), `import { createSiteWorker } from './handler.mjs';\nexport default createSiteWorker(${JSON.stringify(pages)}, ${JSON.stringify(securityHeaders())});\n`);
// Entry aliases match the official Wix hosting adapter's worker output.
for (const entry of ['index.js', 'entry.mjs']) await writeFile(join(output, 'server', entry), "export { default } from './index.mjs';\n");
console.log('Wix build ready: six protected HTML pages, unchanged static assets, JavaScript-only worker.');
