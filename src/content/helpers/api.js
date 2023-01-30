import browser from 'webextension-polyfill';
import pMemoize from 'p-memoize';
import { CACHE_TIME } from '../../shared/constants';

export const getMatchInfo = (matchId) =>
	fetchAPIMemoized(`/match/v2/match/${matchId}`);

export const getLifeTimeStats = (playerId, roomId) => {
	if (Array.isArray(playerId)) {
		return fetchAPIMemoized(
			`/stats/v1/stats/users/lifetime?match_id=${roomId}&game=csgo&player_ids=${playerId.join(
				'&player_ids='
			)}`
		);
	}

	return fetchAPIMemoized(`/stats/v1/stats/users/${playerId}/games/csgo`);
};

export const getPlayerMatches = (playerId) =>
	fetchAPIMemoized(
		`/stats/v1/stats/time/users/${playerId}/games/csgo?size=2000`
	);

const fetchAPI = async (path) => {
	if (typeof path !== 'string') return;

	try {
		const token = localStorage.getItem('token');
		const response =
			(await browser.runtime?.sendMessage({ path, token })) ?? {};
		const { result, code, payload } = response;

		if (
			(result && result.toUpperCase() !== 'OK') ||
			(code && code.toUpperCase() !== 'OPERATION-OK')
		) {
			throw new Error(result, code, payload);
		}

		const returnVal = payload || response;

		return returnVal;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const fetchAPIMemoized = pMemoize(fetchAPI, {
	maxAge: CACHE_TIME,
});
