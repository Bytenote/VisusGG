import assetLoader from 'bun-asset-loader';
import cssLoader from 'bun-css-loader';
import { addReloadCommand, convertManifestV3ToFirefoxV2 } from './utils';

const assetLoaderOptions = {
    assets: [
        {
            from: './src/manifest.json',
            to: './build',
            minify: true,
            transform: (content) => {
                let manifest = JSON.parse(content.toString());

                if (process.env.NODE_ENV === 'development') {
                    manifest = addReloadCommand(manifest);
                }

                if (process.env.BROWSER === 'firefox') {
                    manifest = convertManifestV3ToFirefoxV2(manifest);
                }

                return JSON.stringify(manifest);
            },
        },
        {
            from: './src/assets/icons',
            to: './build',
            filter: /\.png$/,
        },
        {
            from: './src/assets/imgs',
            to: './build/imgs',
            filter: /\.png$/,
        },
        {
            from: './src/contentSteam/contentSteam.css',
            to: './build',
            minify: true,
        },
        {
            from: './src/popup/styles.css',
            to: './build',
            name: 'popup.css',
            minify: true,
        },
        {
            from: './src/popup/index.html',
            to: './build',
            name: 'popup.html',
            minify: true,
        },
    ],
};

const sTime = performance.now();
await Bun.build({
    entrypoints: [
        './src/background/index.js',
        './src/contentFaceIt/index.js',
        './src/contentSteam/index.js',
        './src/popup/index.js',
    ],
    outdir: './build',
    target: 'browser',
    format: 'esm',
    minify: true,
    naming: '[dir].[ext]',
    plugins: [assetLoader(assetLoaderOptions), cssLoader()],
});
const eTime = performance.now();

console.log(`Built in ${eTime - sTime}ms.`);
