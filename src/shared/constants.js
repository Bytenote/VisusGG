export const CACHE_TIME = 1000 * 60 * 7;
export const CREATORS = ['MrMaxim', 'x3picF4ilx'];
export const EXTENSION_NAME = 'VisusGG';
export const DEFAULT_AGE = 1000 * 60 * 60 * 24 * 7;
export const DEFAULT_COLORS = {
	cVal1: '230, 0, 0',
	cVal2: '0, 153, 51',
};
export const DEFAULT_COMPARE_MODE = false;
export const DEFAULT_FACEIT = true;
export const DEFAULT_STEAM = true;
export const DEFAULT_TOGGLES = [
	{
		label: '2d',
		name: '2 days',
		amount: 2,
		type: 'days',
		maxAge: 1000 * 60 * 60 * 24 * 2,
	},
	{
		label: '1w',
		name: '1 week',
		amount: 1,
		type: 'weeks',
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
	{
		label: '2w',
		name: '2 weeks',
		amount: 2,
		type: 'weeks',
		maxAge: 1000 * 60 * 60 * 24 * 14,
	},
];
export const DEFAULT_STORAGE = [
	{ key: 'timeFrame', value: DEFAULT_AGE },
	{ key: 'toggles', value: DEFAULT_TOGGLES },
	{ key: 'usesCompareMode', value: DEFAULT_COMPARE_MODE },
	{ key: 'usesFaceIt', value: DEFAULT_FACEIT },
	{ key: 'usesSteam', value: DEFAULT_STEAM },
	{ key: 'colors', value: DEFAULT_COLORS },
];
export const OBSERVER_OPTIONS = {
	childList: true,
	subtree: true,
};
export const VIP_STEAM_IDS = {
	'76561197985066751': {
		name: 'MrMaxim',
		label: `${EXTENSION_NAME} Creator`,
		color: '#1fa704',
	},
	'76561198119651364': {
		name: 'x3picF4ilx',
		label: `${EXTENSION_NAME} Creator`,
		color: '#1fa704',
	},
	'76561198346163255': {
		name: 'Aquarius',
		label: 'Certified Cat Meme Expert',
		color: '#1fa704',
	},
};
