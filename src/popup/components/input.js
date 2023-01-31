import { EXTENSION_NAME } from '../../shared/constants';

export const inputHandler = (e) => {
	const inputElem = document.querySelector(`#${EXTENSION_NAME}-input`);

	if (/^0*[1-9]\d*$/.test(e.target.value) && +e.target.value <= 999) {
		inputElem.value = e.target.value;
	} else {
		inputElem.value = e.target.value.slice(0, e.target.value.length - 1);
	}
};
