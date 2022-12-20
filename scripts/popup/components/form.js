import { EXTENSION_NAME } from '../../shared/constants';

export const resetForm = () => {
	const inputElem = document.querySelector(`#${EXTENSION_NAME}-input`);
	inputElem.value = null;
};
