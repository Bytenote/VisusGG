import mem from 'mem';
import { getCurrentUserId } from './user';

export const isPlayerOfMatch = (roomId, teams) =>
	getTeamsInfo(roomId, teams)?.isPlayerOfMatch;

export const getOpponents = (roomId, teams) =>
	getTeamsInfo(roomId, teams)?.opponents;

export const getOwnTeam = (roomId, teams) =>
	getTeamsInfo(roomId, teams)?.ownTeam;

export const getOwnTeamSide = (roomId, teams) =>
	getTeamsInfo(roomId, teams)?.ownTeamSide;

const getTeamsInfo = mem((_, teams) => {
	const teamsDetails = {
		ownTeam: [],
		opponents: [],
		isPlayerOfMatch: false,
		ownTeamSide: 0,
	};

	if (isPlayerOfRoster(teams?.faction1?.roster)) {
		teamsDetails.ownTeam = teams?.faction1?.roster ?? [];
		teamsDetails.opponents = teams?.faction2?.roster ?? [];
		teamsDetails.isPlayerOfMatch = true;
		teamsDetails.ownTeamSide = 0;
	} else if (isPlayerOfRoster(teams?.faction2?.roster)) {
		teamsDetails.ownTeam = teams?.faction2?.roster ?? [];
		teamsDetails.opponents = teams?.faction1?.roster ?? [];
		teamsDetails.isPlayerOfMatch = true;
		teamsDetails.ownTeamSide = 1;
	}

	return teamsDetails;
});

const isPlayerOfRoster = (roster) =>
	!!roster?.find((player) => player.id === getCurrentUserId());
