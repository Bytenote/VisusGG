import browser from 'webextension-polyfill';
import { convertRGBToHexColor } from '../../shared/helpers/colorConverter';
import { setSyncStorage } from '../../shared/storage';
import { isEqual } from '../../shared/helpers';
import { setColorPickerValue } from '../components/colorPicker';
import { removeOldToggles, updatePopupElements } from '../components/toggle';
import { setSwitchValue } from '../features/updateSwitches';
import { displayTimeFrameToggle } from '../features/updateTimeFrameToggle';
import { getColorPickerElements, getColorType } from './colorPickerHelpers';

export const initStorageChangeListener = () => {
	browser.storage.local.onChanged.removeListener(updateStorage);
	browser.storage.local.onChanged.addListener(updateStorage);
};

const updateFunc = {
	toggles: (changes) => timeFrameUpdater(changes),
	usesCompareMode: (changes, key) =>
		toggleUpdater(changes, key, 'form-switch-input'),
	usesFaceIt: (changes, key) => toggleUpdater(changes, key, 'toggle-faceit'),
	usesSteam: (changes, key) => toggleUpdater(changes, key, 'toggle-steam'),
	colors: (changes) => colorPickerUpdater(changes),
};

const updateStorage = async (changes = {}) => {
	const [[key, { oldValue, newValue }]] = Object.entries(changes);

	if (!isEqual(oldValue, newValue)) {
		updateFunc[key]?.({ oldValue, newValue }, key);
	}
};

const timeFrameUpdater = async ({ newValue, oldValue }) => {
	setSyncStorage('toggles', newValue);

	function countObjects(arr) {
		return arr.reduce((acc, curr) => {
			const key = JSON.stringify(curr);
			acc.set(key, (acc.get(key) || 0) + 1);

			return acc;
		}, new Map());
	}

	const oldCount = countObjects(oldValue);
	const newCount = countObjects(newValue);
	const newToggle = newValue.find((toggle) => {
		const key = JSON.stringify(toggle);
		const newCountForKey = newCount.get(key) || 0;
		const oldCountForKey = oldCount.get(key) || 0;

		return newCountForKey > oldCountForKey;
	});

	updatePopupElements(false, newToggle);
	removeOldToggles();

	await displayTimeFrameToggle(newToggle.label);
};

const toggleUpdater = async ({ newValue }, storageKey, id) => {
	setSyncStorage(storageKey, newValue);

	setSwitchValue(storageKey, id);
};

const colorPickerUpdater = async ({ newValue }) => {
	const colorPickerElems = getColorPickerElements();

	for (const elem of colorPickerElems) {
		const color = newValue[getColorType(elem)];
		const hexColor = convertRGBToHexColor(color);

		setColorPickerValue(elem, hexColor);
	}
};
