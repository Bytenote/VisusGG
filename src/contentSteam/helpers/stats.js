import {
	getLifeTimeStats,
	getPlayerBans,
	getPlayerInfo,
	getPlayerMatches,
	getProfileBySteamId,
} from '../../shared/helpers/api';

export const getStats = async (steamId) => {
	try {
		const account = await getProfileBySteamId(steamId);
		let playerInfo = {};

		if (account) {
			const { country, guid, id, nickname, status, verified } =
				getHighestSkillLevelAccount(account, playerInfo);

			if (guid || id) {
				const csgoStatsPromise = getLifeTimeStats('csgo', guid || id);
				const cs2StatsPromise = getLifeTimeStats('cs2', guid || id);
				const banPromise = getPlayerBans(guid || id);
				const profilePromise = getPlayerInfo(nickname);
				const csgoMatchesPromise = getPlayerMatches(
					'csgo',
					guid || id,
					20
				);
				const cs2MatchesPromise = getPlayerMatches(
					'cs2',
					guid || id,
					20
				);

				const [
					csgoStats,
					cs2Stats,
					bans,
					profile,
					csgoMatches,
					cs2Matches,
				] = await Promise.all([
					csgoStatsPromise,
					cs2StatsPromise,
					banPromise,
					profilePromise,
					csgoMatchesPromise,
					cs2MatchesPromise,
				]);

				playerInfo.matches =
					cs2Stats?.lifetime?.m1 ?? csgoStats?.lifetime?.m1 ?? '-';
				playerInfo.wins =
					cs2Stats?.lifetime?.m2 ?? csgoStats?.lifetime?.m2 ?? '-';

				playerInfo.elo =
					profile?.games?.cs2?.faceit_elo ??
					profile?.games?.csgo?.faceit_elo ??
					'-';
				playerInfo.membership = getMembershipStatus(
					profile?.memberships,
					status
				);
				playerInfo.createdAt = getAccountCreationDate(
					profile?.created_at ??
						cs2Stats?.lifetime?.created_at ??
						csgoStats?.lifetime?.created_at
				);
				playerInfo.description = getAccountDescription(
					playerInfo.membership,
					playerInfo.createdAt
				);
				if (bans?.[0]?.reason) {
					playerInfo.banReason = bans[0].reason?.toLowerCase();
				}

				const lastMatches = getLast20Matches(csgoMatches, cs2Matches);
				const avgStats = getAverageStats(lastMatches);

				playerInfo.avgKD = avgStats.avgKillsPerDeath ?? '-';
				playerInfo.avgKills = avgStats.avgKills ?? '-';
				playerInfo.avgKR = avgStats.avgKillsPerRound ?? '-';
				playerInfo.avgWins = avgStats.avgWins ?? '-';

				playerInfo.country = country;
				playerInfo.guid = guid;
				playerInfo.id = id;
				playerInfo.nickname = nickname;
				playerInfo.status = status;
				playerInfo.steamId = steamId;
				playerInfo.verified = verified;
			}
		}

		return playerInfo;
	} catch (err) {
		console.log(err);

		return {};
	}
};

const getHighestSkillLevelAccount = (account, playerInfo) => {
	const results = account.players?.results ?? [];
	let highestSkillLevel = -1;
	let highestSkillLevelAccount = {};

	for (const result of results) {
		const csgoResults = (result.games ?? []).find(
			(game) => game.name === 'csgo'
		);
		const cs2Results = (result.games ?? []).find(
			(game) => game.name === 'cs2'
		);

		const skillLevel =
			cs2Results?.skill_level || csgoResults?.skill_level || -1;

		if (skillLevel > highestSkillLevel) {
			highestSkillLevel = skillLevel;
			highestSkillLevelAccount = result;
		}
	}

	playerInfo.level = highestSkillLevel;

	return highestSkillLevelAccount;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getMembershipStatus = (membership, status) => {
	if (status === 'banned') {
		return 'Banned';
	}

	if (status === 'deactivated') {
		return 'Deactivated';
	}

	const premiumMemberShips = ['cs2', 'csgo', 'plus', 'premium'];
	return membership.some((membership) =>
		premiumMemberShips.includes(membership)
	)
		? 'Premium'
		: 'Free';
};

const getAccountCreationDate = (date) => {
	if (!date) {
		return null;
	}

	return new Date(date)?.toLocaleString('ja-JP', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
};

const getAccountDescription = (membership, createdAt) => {
	if (!createdAt || membership === 'Banned') {
		return membership;
	}

	return `${membership} (${createdAt})`;
};

const getLast20Matches = (csgoMatches = [], cs2Matches = []) =>
	cs2Matches.length > 0 &&
	cs2Matches.find((match) => match?.gameMode.includes('5v5'))
		? cs2Matches
		: csgoMatches;

const getAverageStats = (matches) => {
	const avgStats = {};
	let matchAmount = 0;

	const totalStats = matches.reduce(
		(acc, curr) => {
			if (curr?.gameMode.includes('5v5')) {
				acc.kills += +curr?.i6 ?? 0;
				acc.wins += +curr?.i10 ?? 0;
				acc.killsPerDeath += +curr?.c2 ?? 0;
				acc.killsPerRound += +curr?.c3 ?? 0;

				matchAmount += 1;
			}

			return acc;
		},
		{
			kills: 0,
			wins: 0,
			killsPerDeath: 0,
			killsPerRound: 0,
		}
	);

	for (const key in totalStats) {
		if (key === 'kills') {
			avgStats[`avg${capitalize(key)}`] = Math.round(
				totalStats[key] / matchAmount || 0
			);
		} else {
			avgStats[`avg${capitalize(key)}`] = (
				totalStats[key] / matchAmount || 0
			).toFixed(2);
		}
	}

	return avgStats;
};
