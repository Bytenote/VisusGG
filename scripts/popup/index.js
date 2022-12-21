import './styles.css';
import { EXTENSION_NAME } from '../shared/constants';
import { inputHandler } from './components/input';
import {
	displayTimeFrameToggle,
	updateTimeFrame,
} from './features/updateTimeFrameToggle';
import { submitHandler } from './helpers/form';
import { initStorage } from '../shared/storage';

const initPopupElements = async () => {
	const inputElem = document.querySelector(`#${EXTENSION_NAME}-input`);
	const formElem = document.querySelector(`#${EXTENSION_NAME}-form`);

	await displayTimeFrameToggle();

	inputElem.addEventListener('input', inputHandler);
	formElem.addEventListener('submit', submitHandler);
};

(async () => {
	await initStorage();

	chrome.storage.local.onChanged.removeListener(updateTimeFrame);
	chrome.storage.local.onChanged.addListener(updateTimeFrame);

	await initPopupElements();
})();
