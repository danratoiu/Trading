import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const routes = {
  '/': ['index.html', 'text/html'],
  '/index.html': ['index.html', 'text/html'],
  '/calculator': ['calculator.html', 'text/html'],
  '/calculator.html': ['calculator.html', 'text/html'],
  '/calculator/': ['calculator.html', 'text/html'],
  '/styles.css': ['styles.css', 'text/css'],
  '/sidebar.js': ['sidebar.js', 'text/javascript'],
  '/calculator.js': ['calculator.js', 'text/javascript'],
};
createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const route = Object.hasOwn(routes, pathname) ? routes[pathname] : null;
  if (!route) {
    res.writeHead(404).end('Not found');
    return;
  }
  try {
    const content = await readFile(new URL(route[0], import.meta.url));
    res.writeHead(200, { 'Content-Type': `${route[1]}; charset=utf-8` });
    res.end(content);
  } catch {
    res.writeHead(500).end('Unable to load page');
  }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0');
