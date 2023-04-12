import { EXTENSION_NAME } from '../../shared/constants';

export const inputHandler = (e) => {
	const inputElem = document.querySelector(`#${EXTENSION_NAME}-input`);

	if (/^0*[1-9]\d*$/.test(e.target.value) && +e.target.value <= 999) {
		inputElem.value = e.target.value;
	} else {
		inputElem.value = e.target.value.slice(0, e.target.value.length - 1);
	}
};

export const keyDownHandler = (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();

		const inputName = e.target.name;
		const inputElem = document.querySelector(
			`#${EXTENSION_NAME}-${inputName}`
		);
		const buttonElem = document.querySelector(
			`#${EXTENSION_NAME}-${inputName}-btn`
		);

		const formElem = document.querySelector(`#${EXTENSION_NAME}-form`);
		const submitEvent = new SubmitEvent('submit', {
			submitter: buttonElem,
		});

		formElem.dispatchEvent(submitEvent);
		inputElem.blur();
	}
};

export const resetForm = () => {
	const inputElem = document.querySelector(`#${EXTENSION_NAME}-input`);

	inputElem.value = null;
};
