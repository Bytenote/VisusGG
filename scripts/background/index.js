import { faceitAPI } from './helpers/api';

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
	if (!message) return;
	const { path, token } = message;

	const response = faceitAPI(path, token);
	response
		.then((res) => sendResponse(res))
		.catch((err) => {
			console.log(err);
			return false;
		});

	return true;
});
