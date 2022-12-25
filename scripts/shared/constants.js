export const CACHE_TIME = 1000 * 60 * 7;
export const CREATORS = ['MrMaxim', 'x3picF4ilx'];
export const EXTENSION_NAME = 'FACE-M';
export const DEFAULT_AGE = 1000 * 60 * 60 * 24 * 7;
export const DEFAULT_TOGGLES = [
	{
		label: '7d',
		name: '7 days',
		amount: 7,
		type: 'days',
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
	{
		label: '1m',
		name: '1 month',
		amount: 1,
		type: 'months',
		maxAge: 1000 * 60 * 60 * 24 * 30,
	},
	{
		label: '3m',
		name: '3 months',
		amount: 3,
		type: 'months',
		maxAge: 1000 * 60 * 60 * 24 * 30 * 3,
	},
];
