import browser from 'webextension-polyfill';
import pMemoize from 'p-memoize';
import { CACHE_TIME } from '../constants';

export const getMatchInfo = (matchId) =>
	fetchAPIMemoized(`/match/v2/match/${matchId}`);

export const getLifeTimeStats = (playerId, roomId) => {
	if (Array.isArray(playerId)) {
		return fetchAPIMemoized(
			`/stats/v1/stats/users/lifetime?match_id=${roomId}&game=cs2&player_ids=${playerId.join(
				'&player_ids='
			)}`
		);
	}

	return fetchAPIMemoized(`/stats/v1/stats/users/${playerId}/games/cs2`);
};

export const getPlayerMatches = (playerId, size = 100) =>
	fetchAPIMemoized(
		`/stats/v1/stats/time/users/${playerId}/games/cs2?size=${size}`
	);

export const getPlayerHistory = (playerId, from, to) => {
	return fetchAPIMemoized(
		`/data/v4/players/${playerId}/history?game=cs2&from=${from}&to=${to}&limit=100`
	);
};

export const getProfileBySteamId = (steamId) =>
	fetchAPIMemoized(`/search/v1/?query=${steamId}`);

export const getPlayerBans = (playerId) =>
	fetchAPIMemoized(`/sheriff/v1/bans/${playerId}`);

export const getPlayerInfo = (nickname) =>
	fetchAPIMemoized(`/users/v1/nicknames/${nickname}`);

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
