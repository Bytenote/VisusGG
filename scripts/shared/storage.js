import { DEFAULT_AGE, DEFAULT_TOGGLES } from './constants';

const syncStorage = new Map();

export const createLocalStorage = async () => {
	const isEmpty = await hasStorage();
	if (isEmpty) {
		await setStorage('timeFrame', DEFAULT_AGE);
		await setStorage(
			'toggles',
			DEFAULT_TOGGLES.sort((a, b) => a?.maxAge - b?.maxAge)
		);
	}

	if (syncStorage.size < 1) {
		const age = await getStorage('timeFrame');
		const toggles = await getStorage('toggles');

		setSyncStorage('timeFrame', age);
		setSyncStorage(
			'toggles',
			toggles.sort((a, b) => a?.maxAge - b?.maxAge)
		);
	}
};

export const getSyncStorage = (key) => {
	const sto = syncStorage.get(key);
	if (key === 'toggles') {
		return sto.sort((a, b) => a?.maxAge - b?.maxAge);
	}

	return sto;
};

export const setSyncStorage = (key, val) => {
	syncStorage.set(key, val);
	setStorage(key, val);
};

export const setStorage = (key, val) =>
	new Promise((resolve) => {
		chrome.storage.sync
			.set({ [key]: val })
			.then(async () => resolve(true))
			.catch((err) => {
				console.log(err);
				resolve(false);
			});
	});

export const getStorage = (key) =>
	new Promise((resolve) => {
		chrome.storage.sync
			.get(key)
			.then((res) => resolve(key === null ? res : res?.[key]))
			.catch((err) => {
				console.log(err);
				resolve(false);
			});
	});

export const clearStorage = () =>
	new Promise((resolve) => {
		chrome.storage.sync
			.clear()
			.then(() => resolve(true))
			.catch((err) => {
				console.log(err);
				resolve(false);
			});
	});

const getAllStorage = async () => await getStorage(null);

const hasStorage = async () => {
	const sto = await getAllStorage();

	return typeof sto == 'object' ? Object.keys(sto)?.length < 1 : true;
};
