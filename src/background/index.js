import browser from 'webextension-polyfill';
import { faceitAPI } from './helpers/api';

if (process.env.NODE_ENV === 'development') {
	browser.commands.onCommand.addListener((command) => {
		if (command === 'reload_extension') {
			browser.runtime.reload();
		}
	});
}

browser.runtime.onMessage.addListener((message, _, sendResponse) => {
	if (!message) return;
	const { path, token } = message;

	faceitAPI(path, token)
		.then((res) => sendResponse(res))
		.catch((err) => {
			console.log(err);
			return false;
		});

	return true;
});
