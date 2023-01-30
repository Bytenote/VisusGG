import { EXTENSION_NAME } from '../../shared/constants';

export const displaySnackbar = (parent, message) => {
	removeSnackbar();

	const feedbackElem = document.createElement('div');
	feedbackElem.classList.add(`${EXTENSION_NAME}-feedback`);
	feedbackElem.textContent = message;

	parent.append(feedbackElem);

	setTimeout(() => {
		feedbackElem.remove();
	}, 1500);
};

const removeSnackbar = () => {
	const feedbackElem = document.querySelector(`.${EXTENSION_NAME}-feedback`);
	if (feedbackElem) {
		feedbackElem.remove();
	}
};
