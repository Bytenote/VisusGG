import fs from 'fs';
import path from 'path';
import packageJson from '../package.json';
import manifestJson from '../src/manifest.json';

manifestJson.version = packageJson.version;

fs.writeFileSync(
    path.resolve(__dirname, '../src/manifest.json'),
    JSON.stringify(manifestJson, null, 2)
);

console.log(`Updated manifest.json version to ${packageJson.version}`);
