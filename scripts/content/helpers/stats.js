import mem from 'mem';
import pMemoize from 'p-memoize';
import { getOpponents } from './matchroom';
import { getLifeTimeStats, getPlayerMatches } from './api';
import { getSyncStorage } from '../../shared/storage';

export const loadMapStatsMemoized = pMemoize((_, matchInfo) =>
	loadMapStats(matchInfo)
);

export const getMapDictMemoized = mem((_, maps) => getMapDict(maps));

export const getMapStats = (map, maps, stats) => {
	if (stats) {
		const mapObj = maps?.[map];

		if (mapObj) {
			return (
				stats[mapObj.class_name] ||
				stats[mapObj.game_map_id] ||
				stats[mapObj.name]
			);
		}
	}

	return false;
};

const loadMapStats = async (matchInfo) => {
	try {
		let teamStats = {};

		if (matchInfo?.teams) {
			const opponents = getOpponents(matchInfo.teams);
			if (opponents && opponents.length > 0) {
				const playerPromises = [];
				// const playerIds = [];

				for (const { id } of opponents) {
					playerPromises.push(getPlayerMatches(id));
					// playerIds.push(id);
				}

				const playersStats = await Promise.all(playerPromises);
				// const lifetimeStats = await getLifeTimeStats(
				// 	playerIds,
				// 	matchInfo.id
				// );

				teamStats = getTeamStats(
					playersStats,
					teamStats,
					opponents,
					matchInfo
				);
			}
		}

		return teamStats;
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

const getTeamStats = (playersStats, teamStats, opponents, matchInfo) => {
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
					finalizeStats(teamStats, playerStats, nickname);

					break;
				}

				if (i === player.length - 1) {
					finalizeStats(teamStats, playerStats, nickname);
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
		players: {},
		playerArr: [],
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

const finalizeStats = (teamStats, playerStats, nickname) => {
	for (const recentMap in playerStats) {
		playerStats[recentMap].winRate = Math.round(
			(playerStats[recentMap].wins / playerStats[recentMap].matches) * 100
		);

		teamStats[recentMap].players[nickname] = playerStats[recentMap];

		if (!teamStats[recentMap].playerArr.includes(nickname)) {
			teamStats[recentMap].playerArr.push(nickname);
		}
	}
};

const addTeamWinRate = (teamStats) => {
	for (const mapProp in teamStats) {
		const mapStats = teamStats[mapProp];
		const players = mapStats.playerArr;

		teamStats[mapProp].winRate = Math.round(
			players.reduce(
				(acc, curr) => acc + mapStats.players[curr]?.winRate,
				0
			) / players.length
		);
	}
};
