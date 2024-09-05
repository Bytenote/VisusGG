import {
    getLifeTimeStats,
    getPlayerBans,
    getPlayerInfo,
    getPlayerMatches,
    getProfileBySteamId,
} from '../../shared/helpers/api';

export const getStats = async (steamId, selectedGame) => {
    try {
        const accountRes = await getProfileBySteamId(steamId);
        let playerInfo = {};

        if (accountRes) {
            const csAccounts = accountRes?.players?.results?.filter((player) =>
                player?.games?.some((game) =>
                    ['cs2', 'csgo'].includes(game?.name?.toLowerCase())
                )
            );
            if (csAccounts.length === 0) {
                return playerInfo;
            }

            const orderedAccounts = getOrderedAccountsByPriority(csAccounts);
            for (const {
                country,
                guid,
                id,
                nickname,
                status,
                verified,
            } of orderedAccounts) {
                if (guid || id) {
                    const csgoStatsPromise = getLifeTimeStats(
                        'csgo',
                        guid || id
                    );
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

                    const hasMatchingSteamId =
                        profile?.games?.cs2?.game_id === steamId ||
                        profile?.games?.csgo?.game_id === steamId ||
                        false;
                    if (hasMatchingSteamId) {
                        playerInfo.cs2 = getAvgStats(
                            cs2Matches,
                            cs2Stats,
                            profile,
                            'cs2'
                        );
                        playerInfo.csgo = getAvgStats(
                            csgoMatches,
                            csgoStats,
                            profile,
                            'csgo'
                        );

                        selectedGame = !!selectedGame
                            ? selectedGame
                            : getSelectedGame(cs2Matches);

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
                            playerInfo.banReason =
                                bans[0].reason?.toLowerCase();
                        }

                        playerInfo.country = country;
                        playerInfo.guid = guid;
                        playerInfo.id = id;
                        playerInfo.nickname = nickname;
                        playerInfo.status = status;
                        playerInfo.steamId = steamId;
                        playerInfo.verified = verified;

                        break;
                    }
                }
            }
        }

        return { stats: playerInfo, selectedGame };
    } catch (err) {
        console.log(err);

        return {};
    }
};

const getOrderedAccountsByPriority = (accounts) => {
    return accounts.sort((a, b) => {
        const getOrderPriority = (account) => {
            const games = account?.games ?? [];
            const status = account?.status ?? '';

            const priority = games.reduce((acc, curr) => {
                if (status === 'AVAILABLE' && curr.name === 'cs2') {
                    return Math.min(acc, 1);
                }
                if (status === 'AVAILABLE' && curr.name === 'csgo') {
                    return Math.min(acc, 2);
                }
                if (curr.name === 'cs2') {
                    return Math.min(acc, 3);
                }
                if (curr.name === 'csgo') {
                    return Math.min(acc, 4);
                }

                return acc;
            }, 5);

            return priority;
        };

        const aPriority = getOrderPriority(a);
        const bPriority = getOrderPriority(b);

        return aPriority - bPriority;
    });
};

const getAvgStats = (matches, stats, profile, game) => {
    const avgStats = {};
    let matchAmount = 0;
    let hasPlayed = true;

    const totalStats = matches.reduce(
        (acc, curr) => {
            if (curr?.gameMode?.includes('5v5')) {
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
        const value = totalStats[key] / matchAmount || 0;

        if (key !== 'wins' && value === 0) {
            avgStats[`avg${capitalize(key)}`] = '-';
            hasPlayed = false;
        } else {
            avgStats[`avg${capitalize(key)}`] =
                key === 'kills' ? Math.round(value) : value.toFixed(2);
        }
    }

    avgStats.level = hasPlayed
        ? (profile.games?.[game]?.skill_level ?? '-')
        : '-';
    avgStats.elo = hasPlayed
        ? (profile?.games?.[game]?.faceit_elo ?? '-')
        : '-';
    avgStats.matches = hasPlayed ? (stats?.lifetime?.m1 ?? '-') : '-';
    avgStats.wins = hasPlayed ? (stats?.lifetime?.m2 ?? '-') : '-';

    return avgStats;
};

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

const getSelectedGame = (cs2Matches = []) =>
    cs2Matches.length > 0 &&
    cs2Matches.find((match) => match?.gameMode.includes('5v5'))
        ? 'cs2'
        : 'csgo';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
