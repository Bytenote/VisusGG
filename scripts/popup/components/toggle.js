import { EXTENSION_NAME } from '../../shared/constants';
import { getToggleInfo } from '../helpers/toggles';

export const initToggleButtons = (toggles, buttonGroupElem) => {
	for (const toggle of toggles) {
		const button = createButton(toggle.label, `${EXTENSION_NAME}-toggle`);

		buttonGroupElem.append(button);
	}
};

export const removeOldToggles = () => {
	const toggleGroupChildren = [
		...document.querySelector(`#${EXTENSION_NAME}-button-group`)?.children,
	];
	toggleGroupChildren.forEach((toggle) => {
		if (toggle.classList.contains(`${EXTENSION_NAME}-toggle`)) {
			toggle.remove();
		}
	});
};

export const updatePopupElements = (isDisabled, caller = null) => {
	const formEditElems = [
		...document.querySelector(`#${EXTENSION_NAME}-form-edit`)?.children,
	];
	const heading = document.querySelector(`#${EXTENSION_NAME}-heading`);
	let headingText = 'Select button to edit';

	for (const elem of formEditElems) {
		elem.disabled = isDisabled;
	}

	if (!isDisabled) {
		const selectElem = document.querySelector(`#${EXTENSION_NAME}-select`);
		const toggle = getToggleInfo(caller.textContent);

		if (toggle?.type) {
			selectElem.value = toggle.type;
		}

		headingText = 'Editing button';
	}

	heading.textContent = headingText;
};

const createButton = (label, cssClass) => {
	const button = document.createElement('button');

	button.classList.add(cssClass);
	button.addEventListener('click', clickHandler);

	button.textContent = label;

	return button;
};

const clickHandler = (e) => {
	const activeButtons = document.querySelectorAll(
		`.${EXTENSION_NAME}-toggle-active`
	);

	if (e.currentTarget.classList.contains(`${EXTENSION_NAME}-toggle-active`)) {
		e.currentTarget.classList.remove(`${EXTENSION_NAME}-toggle-active`);

		updatePopupElements(true);
	} else {
		for (const button of activeButtons) {
			button.classList.remove(`${EXTENSION_NAME}-toggle-active`);
		}
		e.currentTarget?.classList.add(`${EXTENSION_NAME}-toggle-active`);

		updatePopupElements(false, e.currentTarget);
	}
};
