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
	toggles: (newValue) => timeFrameUpdater(newValue),
	usesCompareMode: (newValue, key) =>
		toggleUpdater(newValue, key, 'form-switch-input'),
	usesFaceIt: (newValue, key) =>
		toggleUpdater(newValue, key, 'toggle-faceit'),
	usesSteam: (newValue, key) => toggleUpdater(newValue, key, 'toggle-steam'),
	colors: (newValue) => colorPickerUpdater(newValue),
};

const updateStorage = async (changes) => {
	const [[key, { oldValue, newValue }]] = Object.entries(changes);

	if (!isEqual(oldValue, newValue)) {
		updateFunc[key]?.(newValue, key);
	}
};

const timeFrameUpdater = async (newValue) => {
	setSyncStorage('toggles', newValue);

	updatePopupElements(true);
	removeOldToggles();

	await displayTimeFrameToggle();
};

const toggleUpdater = async (newValue, storageKey, id) => {
	setSyncStorage(storageKey, newValue);

	setSwitchValue(storageKey, id);
};

const colorPickerUpdater = async (newValue) => {
	const colorPickerElems = getColorPickerElements();

	for (const elem of colorPickerElems) {
		const color = newValue[getColorType(elem)];
		const hexColor = convertRGBToHexColor(color);

		setColorPickerValue(elem, hexColor);
	}
};
