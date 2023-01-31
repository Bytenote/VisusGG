import browser from 'webextension-polyfill';
import pRetry from 'p-retry';

const BASE_URL = 'https://api.faceit.com';

export const faceitAPI = async function (path, token = null) {
	try {
		token =
			(await browser?.cookies.get({
				name: 't',
				url: 'https://faceit.com',
			})?.value) || token;
		const options = {
			headers: {
				...(token && { Authorization: `Bearer ${token}` }),
			},
		};

		const response = await pRetry(
			() =>
				fetch(`${BASE_URL}${path}`, options).then((res) => {
					if (res.status === 404) {
						throw new pRetry.AbortError(res.statusText);
					} else if (!res.ok) {
						throw new Error(res.statusText);
					}
					return res;
				}),
			{
				retries: 3,
			}
		);

		const json = await response.json();

		return json;
	} catch (err) {
		console.log(err);
		return null;
	}
};
