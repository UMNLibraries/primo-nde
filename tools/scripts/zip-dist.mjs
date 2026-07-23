import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const [, , sourcePath, targetPath] = process.argv;

if (!sourcePath || !targetPath) {
  console.error('Usage: node zip-dist.mjs <sourceDir> <targetPath>');
  process.exit(1);
}

const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const output = fs.createWriteStream(targetPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () =>
  console.log(
    `Successfully zipped ${archive.pointer()} total bytes to ${targetPath}`,
  ),
);
archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(sourcePath, path.basename(sourcePath));
archive.finalize();
