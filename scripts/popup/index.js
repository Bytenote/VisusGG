import './styles.css';
import { EXTENSION_NAME } from '../shared/constants';
import { inputHandler } from './components/input';
import { displayTimeFrameToggle } from './features/updateTimeFrameToggle';
import { submitHandler } from './helpers/submitters';
import { initStorage } from '../shared/storage';
import { updateStorage } from './helpers/storageChanges';
import { setSwitchValue } from './features/updateCompareModeSwitch';
import { setColorPickersColors } from './features/updateColorPicker';

const initPopupElements = async () => {
	const inputElem = document.querySelector(`#${EXTENSION_NAME}-input`);
	const formElem = document.querySelector(`#${EXTENSION_NAME}-form`);

	setSwitchValue();
	setColorPickersColors();
	await displayTimeFrameToggle();

	inputElem.addEventListener('input', inputHandler);
	formElem.addEventListener('submit', submitHandler);
};

(async () => {
	await initStorage();

	chrome.storage.local.onChanged.removeListener(updateStorage);
	chrome.storage.local.onChanged.addListener(updateStorage);

	await initPopupElements();
})();
