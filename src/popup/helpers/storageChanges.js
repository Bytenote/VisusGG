import browser from 'webextension-polyfill';
import { convertRGBToHexColor } from '../../shared/colorConverter';
import { EXTENSION_NAME } from '../../shared/constants';
import { setSyncStorage } from '../../shared/storage';
import { isEqual } from '../../shared/helpers';
import { setColorPickerValue } from '../components/colorPicker';
import { removeOldToggles, updatePopupElements } from '../components/toggle';
import { setSwitchValue } from '../features/updateCompareModeSwitch';
import { displayTimeFrameToggle } from '../features/updateTimeFrameToggle';
import { getColorPickerElements, getColorType } from './colorPickerHelpers';

export const initStorageChangeListener = () => {
	browser.storage.local.onChanged.removeListener(updateStorage);
	browser.storage.local.onChanged.addListener(updateStorage);
};

const updateStorage = async (changes) => {
	const [[key, { oldValue, newValue }]] = Object.entries(changes);

	if (!isEqual(oldValue, newValue)) {
		updateFunc[key]?.(newValue);
	}
};

const updateFunc = {
	toggles: (newValue) => toggleUpdater(newValue),
	usesCompareMode: (newValue) => compareModeUpdater(newValue),
	colors: (newValue) => colorPickerUpdater(newValue),
};

const toggleUpdater = async (newValue) => {
	setSyncStorage('toggles', newValue);

	updatePopupElements(true);
	removeOldToggles();

	await displayTimeFrameToggle();
};

const compareModeUpdater = async (newValue) => {
	const switchElem = document.querySelector(
		`#${EXTENSION_NAME}-form-switch-input`
	);

	setSyncStorage('usesCompareMode', newValue);

	setSwitchValue(switchElem);
};

const colorPickerUpdater = async (newValue) => {
	const colorPickerElems = getColorPickerElements();

	for (const elem of colorPickerElems) {
		const color = newValue[getColorType(elem)];
		const hexColor = convertRGBToHexColor(color);

		setColorPickerValue(elem, hexColor);
	}
};
