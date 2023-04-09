import { EXTENSION_NAME } from '../../shared/constants';
import {
	colorPickerInputHandler,
	getColorPickerElements,
} from './colorPickerHelpers';
import { inputHandler, keyDownHandler } from './inputHandlers';
import {
	colorPickerSubmitter,
	submitHandler,
	switchSubmitter,
} from './submitters';

export const initFormListeners = () => {
	const colorPickerElem = getColorPickerElements();
	const inputElem = document.querySelector(`#${EXTENSION_NAME}-input`);
	const switchElem = document.querySelector(
		`#${EXTENSION_NAME}-form-switch-input`
	);
	const formElem = document.querySelector(`#${EXTENSION_NAME}-form`);

	for (const elem of colorPickerElem) {
		elem.addEventListener('input', colorPickerInputHandler);
		elem.addEventListener('change', colorPickerSubmitter);
	}

	inputElem.addEventListener('input', inputHandler);
	inputElem.addEventListener('keydown', keyDownHandler);
	switchElem.addEventListener('change', switchSubmitter);
	formElem.addEventListener('submit', submitHandler);
};
