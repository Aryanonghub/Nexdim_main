import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

// Resolves <!--include:name.html--> markers against src/partials/, so repeated
// markup (head boilerplate, the theme toggle button) lives in one file instead
// of being copy-pasted across every page.
function htmlIncludes() {
  const partialsDir = resolve(import.meta.dirname, 'src/partials');
  return {
    name: 'html-includes',
    transformIndexHtml(html) {
      return html.replace(/<!--\s*include:(\S+?)\s*-->/g, (_, name) =>
        readFileSync(resolve(partialsDir, name), 'utf-8')
      );
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), htmlIncludes()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        velmora: resolve(import.meta.dirname, 'velmora.html'),
      },
    },
  },
});
