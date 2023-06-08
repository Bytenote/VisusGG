import mem from 'mem';
import pMemoize from 'p-memoize';
import { getOpponents, getOwnTeam, getOwnTeamSide } from './teams';
import { getPlayerMatches } from '../../shared/helpers/api';
import { getSyncStorage } from '../../shared/storage';
import { getCurrentUserId } from './user';

export const loadMapStatsMemoized = pMemoize((_, matchInfo) =>
	loadMapStats(matchInfo)
);

export const getMapDictMemoized = mem((_, maps) => getMapDict(maps));

export const getMapStats = (map, maps, stats, matchInfo) => {
	const usesCompareMode = getSyncStorage('usesCompareMode');
	const opponentStats = stats?.opponents;
	const ownTeamStats = stats?.ownTeam;

	if (opponentStats && ownTeamStats) {
		const mapObj = maps[map];

		if (mapObj) {
			const opponentMapStats =
				getMapStatsObject(opponentStats, mapObj) ?? {};
			const mapStats = [opponentMapStats];

			if (usesCompareMode) {
				const ownTeamMapStats =
					getMapStatsObject(ownTeamStats, mapObj) ?? {};

				if (getOwnTeamSide(matchInfo.id, matchInfo.teams) > 0) {
					ownTeamMapStats['ownTeamSide'] = 1;
					mapStats.push(ownTeamMapStats);
				} else {
					ownTeamMapStats['ownTeamSide'] = 0;
					mapStats.unshift(ownTeamMapStats);
				}
			}

			return mapStats;
		}
	}

	return [];
};

const loadMapStats = async (matchInfo) => {
	try {
		const usesCompareMode = getSyncStorage('usesCompareMode');

		let teamsStats = {
			opponents: {},
			ownTeam: {},
		};

		if (matchInfo?.teams) {
			const opponents = getOpponents(matchInfo.id, matchInfo.teams);
			const teammates = getOwnTeam(matchInfo.id, matchInfo.teams);

			if (opponents?.length > 0 && teammates?.length > 0) {
				let opponentResponse = [];
				let ownTeamResponse = [];

				const playerStatsPromises =
					getPlayerStatsPromisesDependingOnMode(
						opponents,
						teammates,
						usesCompareMode
					);
				const response = await Promise.all(playerStatsPromises);

				if (usesCompareMode) {
					opponentResponse = response.slice(0, opponents.length);
					ownTeamResponse = response.slice(opponents.length);

					teamsStats.ownTeam = getTeamStats(
						ownTeamResponse,
						teammates,
						matchInfo
					);
				} else {
					opponentResponse = response;
				}

				teamsStats.opponents = getTeamStats(
					opponentResponse,
					opponents,
					matchInfo
				);
			}
		}

		return teamsStats;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const getMapDict = (maps = []) => {
	const mapsObj = {};

	maps.forEach(({ image_lg, image_sm, ...mapProps }) => {
		let workshopName = '';

		if (!isNaN(mapProps.game_map_id)) {
			workshopName = `workshop/${mapProps.game_map_id}/${mapProps.class_name}`;
			mapsObj[workshopName] = {
				...mapProps,
				game_map_id: workshopName,
			};
		}
		mapsObj[mapProps.name] = {
			...mapProps,
			...(workshopName && { game_map_id: workshopName }),
		};
		mapsObj[mapProps.class_name] = {
			...mapProps,
			...(workshopName && { game_map_id: workshopName }),
		};
	});

	return mapsObj;
};

const getMapStatsObject = (stats, mapObj) =>
	stats[mapObj.class_name] || stats[mapObj.game_map_id] || stats[mapObj.name];

const getPlayerStatsPromisesDependingOnMode = (
	opponents,
	teammates,
	usesCompareMode
) =>
	usesCompareMode
		? [...opponents, ...teammates].map(({ id }) => getPlayerMatches(id))
		: opponents.map(({ id }) => getPlayerMatches(id));

const getTeamStats = (playersStats, opponents, matchInfo) => {
	const teamStats = {};

	if (playersStats?.length === opponents.length) {
		for (const player of playersStats) {
			let playerStats = {};

			for (let [
				i,
				{
					gameMode,
					date,
					i1: map,
					i2: winningTeamId,
					teamId,
					playerId,
					nickname,
				},
			] of player.entries()) {
				const inTimeFrame = isInTimeFrame(matchInfo?.createdAt, date);
				if (inTimeFrame) {
					if (
						gameMode === matchInfo.matchCustom?.overview?.name ||
						gameMode ===
							matchInfo.matchCustom?.overview?.elo_type ||
						matchInfo.matchCustom?.overview?.name.includes(
							gameMode
						) ||
						matchInfo.entity?.name.includes(gameMode)
					) {
						if (map === 'workshop/125995702/aim_redline') {
							map = 'workshop/125995702/aim_redline_original';
						}

						if (!teamStats[map]) {
							teamStats[map] = getTeamStatObj();
							teamStats[map].map =
								getMapDictMemoized(
									matchInfo.id,
									matchInfo?.matchCustom?.tree?.map?.values
										?.value
								)?.[map]?.name || null;
						}
						if (!playerStats[map]) {
							playerStats[map] = getPlayerStatObj(playerId);
						}
						if (winningTeamId === teamId) {
							teamStats[map].wins += 1;
							playerStats[map].wins += 1;
						}

						teamStats[map].matches += 1;
						playerStats[map].matches += 1;
					}
				} else if (inTimeFrame === false) {
					addPlayerMapStats(teamStats, playerStats, nickname);

					break;
				}

				if (i === player.length - 1) {
					addPlayerMapStats(teamStats, playerStats, nickname);
				}
			}
		}

		addTeamWinRate(teamStats);
	}

	return teamStats;
};

const isInTimeFrame = (startDate, endDate) => {
	const maxAge = getSyncStorage('timeFrame');
	startDate = new Date(startDate).getTime();

	if (startDate > endDate) {
		if (startDate - maxAge < endDate) {
			return true;
		}

		return false;
	}

	return null;
};

const getTeamStatObj = () => {
	const obj = {
		map: '',
		matches: 0,
		players: new Map(),
		winRate: 0,
		wins: 0,
	};

	return obj;
};

const getPlayerStatObj = (playerId) => {
	const obj = {
		matches: 0,
		playerId,
		winRate: 0,
		wins: 0,
	};

	return obj;
};

const addPlayerMapStats = (teamStats, playerStats, nickname) => {
	for (const recentMap in playerStats) {
		playerStats[recentMap].winRate = Math.round(
			(playerStats[recentMap].wins / playerStats[recentMap].matches) * 100
		);

		teamStats[recentMap].players.set(nickname, playerStats[recentMap]);

		if (playerStats[recentMap]?.playerId === getCurrentUserId()) {
			playerStats[recentMap]['isCurrentUser'] = true;
		}
	}
};

const addTeamWinRate = (teamStats) => {
	for (const mapProp in teamStats) {
		const mapStats = teamStats[mapProp];
		const players = [...mapStats.players.keys()];

		teamStats[mapProp].winRate = Math.round(
			players.reduce(
				(acc, curr) => acc + mapStats.players.get(curr)?.winRate,
				0
			) / mapStats.players.size
		);
	}
};
