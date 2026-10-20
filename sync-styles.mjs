import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Keep both static pages self-contained, including when served by GitHub Pages.
const css = (await readFile(new URL('./styles.css', import.meta.url), 'utf8')).trim();
for (const name of ['index.html', 'calculator.html']) {
  const file = new URL(name, import.meta.url);
  const html = await readFile(file, 'utf8');
  if (!/<style>[\s\S]*?<\/style>/.test(html)) throw new Error(`Missing style block in ${name}`);
  let output = html.replace(/<style>[\s\S]*?<\/style>/, () => `<style>\n${css}\n  </style>`);
  // Refresh cached scripts whenever their contents change on GitHub Pages.
  for (const script of ['sidebar.js', 'calculator.js']) {
    const contents = await readFile(new URL(script, import.meta.url));
    const version = createHash('sha256').update(contents).digest('hex').slice(0, 12);
    output = output.replace(new RegExp(`src="\\./${script.replace('.', '\\.')}([^" ]*)"`, 'g'), `src="./${script}?v=${version}"`);
  }
  await writeFile(file, output);
}
