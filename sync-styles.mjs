import { readFile, writeFile } from 'node:fs/promises';

// Keep both static pages self-contained, including when served by GitHub Pages.
const css = (await readFile(new URL('./styles.css', import.meta.url), 'utf8')).trim();
for (const name of ['index.html', 'calculator.html']) {
  const file = new URL(name, import.meta.url);
  const html = await readFile(file, 'utf8');
  if (!/<style>[\s\S]*?<\/style>/.test(html)) throw new Error(`Missing style block in ${name}`);
  await writeFile(file, html.replace(/<style>[\s\S]*?<\/style>/, () => `<style>\n${css}\n  </style>`));
}
