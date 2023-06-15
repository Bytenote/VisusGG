import { getToggleInfo } from '../helpers/toggles';

export const initToggleButtons = (toggles, buttonGroupElem) => {
	for (const toggle of toggles) {
		const button = createButton(toggle.label, 'toggle-btn');

		buttonGroupElem.append(button);
	}
};

export const removeOldToggles = () => {
	const toggleGroupChildren = [
		...document.querySelector('#button-edit-group')?.children,
	];
	toggleGroupChildren.forEach((toggle) => {
		if (toggle.classList.contains('toggle-btn')) {
			toggle.remove();
		}
	});
};

export const updatePopupElements = (isDisabled, caller = null) => {
	const formEditElems = [
		...document.querySelector('#form-btn-edit')?.children,
	];
	const heading = document.querySelector('#button-edit-div');
	let headingText = 'Select button to edit';

	for (const elem of formEditElems) {
		for (const child of elem.children) {
			child.disabled = isDisabled;
		}
	}

	if (!isDisabled) {
		const selectElem = document.querySelector('#form-select');
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
	const activeButtons = document.querySelectorAll('.toggle-btn-active');

	if (e.currentTarget.classList.contains('toggle-btn-active')) {
		e.currentTarget.classList.remove('toggle-btn-active');

		updatePopupElements(true);
	} else {
		for (const button of activeButtons) {
			button.classList.remove('toggle-btn-active');
		}
		e.currentTarget?.classList.add('toggle-btn-active');

		updatePopupElements(false, e.currentTarget);
	}
};
