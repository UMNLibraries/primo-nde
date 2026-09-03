import fs from 'node:fs';
import path from 'node:path';

const distPath = process.argv[2];

if (!distPath || !fs.existsSync(distPath)) {
  console.log(`[minify-json] Skipping: Path "${distPath}" not found.`);
  process.exit(0);
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      try {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const minified = JSON.stringify(JSON.parse(raw));
        fs.writeFileSync(fullPath, minified);
      } catch (err) {
        console.warn(
          `[minify-json] Could not minify ${fullPath}: ${err.message}`,
        );
      }
    }
  }
}

processDirectory(distPath);
console.log(`[minify-json] Minified JSON assets in: ${distPath}`);
