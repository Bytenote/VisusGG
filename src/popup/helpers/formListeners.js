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
	const ELEMS = [
		{ id: 'form-input', event: 'input', handler: inputHandler },
		{ id: 'form-input', event: 'keydown', handler: keyDownHandler },
		{
			id: 'form-switch-input',
			event: 'change',
			handler: onCompareModeChange,
		},
		{ id: 'toggle-faceit', event: 'change', handler: onFaceItChange },
		{ id: 'toggle-steam', event: 'change', handler: onSteamChange },
		{ id: 'form', event: 'submit', handler: submitHandler },
	];

	for (const elem of colorPickerElem) {
		elem.addEventListener('input', colorPickerInputHandler);
		elem.addEventListener('change', colorPickerSubmitter);
	}

	ELEMS.forEach(({ id, event, handler }) => {
		const elem = document.querySelector(`#${id}`);
		elem.addEventListener(event, handler);
	});
};

const onCompareModeChange = (e) => {
	switchSubmitter(e, 'usesCompareMode');
};

const onFaceItChange = (e) => {
	switchSubmitter(e, 'usesFaceIt');
};

const onSteamChange = (e) => {
	switchSubmitter(e, 'usesSteam');
};
