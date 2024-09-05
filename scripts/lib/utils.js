import assetLoader from 'bun-asset-loader';
import cssLoader from 'bun-css-loader';
import { WEB_ACCESSIBLE_RESOURCES } from './constants';

export const generateBuildOptions = (browser) => {
    const basePath = `./build/${browser}`;

    return {
        entrypoints: [
            './src/background/index.js',
            './src/contentFaceIt/index.js',
            './src/contentSteam/index.js',
            './src/popup/index.js',
        ],
        outdir: basePath,
        target: 'browser',
        format: 'esm',
        minify: true,
        sourcemap: isDev ? 'inline' : 'none',
        naming: '[dir].[ext]',
        plugins: [
            assetLoader(generateAssetLoaderOptions(basePath)),
            cssLoader(),
        ],
    };
};

const generateAssetLoaderOptions = (basePath) => {
    const isChrome = basePath === './build/chrome';
    const transformFunc = isChrome ? transformChrome : transformFirefox;

    return {
        assets: [
            {
                from: './src/manifest.json',
                to: basePath,
                minify: true,
                transform: transformFunc,
            },
            {
                from: './src/assets/icons',
                to: basePath,
                filter: /\.png$/,
            },
            {
                from: './src/assets/imgs',
                to: `${basePath}/imgs`,
                filter: /\.png$/,
            },
            {
                from: './src/contentSteam/contentSteam.css',
                to: basePath,
                minify: true,
            },
            {
                from: './src/popup/styles.css',
                to: basePath,
                name: 'popup.css',
                minify: true,
            },
            {
                from: './src/popup/index.html',
                to: basePath,
                name: 'popup.html',
                minify: true,
            },
        ],
    };
};

const transformChrome = (content) => {
    let manifest = JSON.parse(content.toString());

    if (isDev) {
        manifest = addReloadCommand(manifest);
    }

    return JSON.stringify(manifest);
};

const transformFirefox = (content) => {
    let manifest = JSON.parse(content.toString());

    if (isDev) {
        manifest = addReloadCommand(manifest);
    }
    manifest = convertManifestV3ToFirefoxV2(manifest);

    return JSON.stringify(manifest);
};

const addReloadCommand = (manifest) => {
    manifest.commands = {
        reload_extension: {
            suggested_key: {
                default: 'Ctrl+Shift+E',
                mac: 'Command+Shift+E',
            },
            description: 'Reload in dev mode',
        },
    };

    return manifest;
};

const convertManifestV3ToFirefoxV2 = (manifest) => {
    manifest.manifest_version = 2;
    manifest.background = {
        scripts: ['background.js'],
    };
    manifest.content_scripts[0] = {
        ...manifest.content_scripts[0],
        all_frames: false,
    };
    manifest['browser_action'] = manifest.action;
    manifest.web_accessible_resources = WEB_ACCESSIBLE_RESOURCES;
    manifest.permissions = [
        ...manifest.permissions,
        ...manifest.host_permissions,
    ];

    manifest['browser_specific_settings'] = {
        gecko: {
            id: '{13c012e0-7b3e-48d8-8067-3f8504f91913}',
            strict_min_version: '58.0',
        },
    };

    delete manifest.action;
    delete manifest.host_permissions;

    return manifest;
};

const isDev = process.env.NODE_ENV === 'development';
