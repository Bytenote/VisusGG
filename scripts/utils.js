export const addReloadCommand = (manifest) => {
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

export const convertManifestV3ToFirefoxV2 = (manifest) => {
	manifest.manifest_version = 2;
	manifest.background = {
		scripts: ['background.js'],
	};
	manifest.content_scripts[0] = {
		...manifest.content_scripts[0],
		all_frames: false,
	};
	manifest['browser_action'] = manifest.action;
	manifest.web_accessible_resources = [
		'imgs/f00.png',
		'imgs/f01.png',
		'imgs/f02.png',
		'imgs/f03.png',
		'imgs/f04.png',
		'imgs/f05.png',
		'imgs/f06.png',
		'imgs/f07.png',
		'imgs/f08.png',
		'imgs/f09.png',
		'imgs/f10.png',
	];
	manifest.permissions = [
		...manifest.permissions,
		...manifest.host_permissions,
	];

	if (process.env.NODE_ENV === 'development') {
		manifest['browser_specific_settings'] = {
			gecko: {
				id: 'addon@example.com',
				strict_min_version: '42.0',
			},
		};
	}

	delete manifest.action;
	delete manifest.host_permissions;

	return manifest;
};
