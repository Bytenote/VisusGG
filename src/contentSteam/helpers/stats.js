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
				(account.players?.results ?? []).find((player) =>
					(player.games ?? []).some((game) => {
						if (game.name === 'csgo') {
							playerInfo.level = game.skill_level;

							return true;
						}
					})
				) ?? {};

			if (guid || id) {
				const statsPromise = getLifeTimeStats(guid || id);
				const banPromise = getPlayerBans(guid || id);
				const profilePromise = getPlayerInfo(nickname);
				const matchesPromise = getPlayerMatches(guid || id, 20);

				const [stats, bans, profile, matches] = await Promise.all([
					statsPromise,
					banPromise,
					profilePromise,
					matchesPromise,
				]);

				playerInfo.matches = stats?.lifetime?.m1 ?? '-';
				playerInfo.wins = stats?.lifetime?.m2 ?? '-';

				playerInfo.elo = profile?.games?.csgo?.faceit_elo ?? '-';
				playerInfo.membership = getMembershipStatus(
					profile?.memberships,
					status
				);
				playerInfo.createdAt = getAccountCreationDate(
					profile?.created_at ?? stats?.lifetime?.created_at
				);
				playerInfo.description = getAccountDescription(
					playerInfo.membership,
					playerInfo.createdAt
				);
				if (bans?.[0]?.reason) {
					playerInfo.banReason = bans[0].reason?.toLowerCase();
				}

				const avgStats = getAverageStats(matches);
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

const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const getMembershipStatus = (membership, status) => {
	if (status === 'banned') {
		return 'Banned';
	}

	if (status === 'deactivated') {
		return 'Deactivated';
	}

	const premiumMemberShips = ['csgo', 'premium'];
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

const getAverageStats = (matches = []) => {
	let matchAmount = 0;
	const avgStats = {};

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
