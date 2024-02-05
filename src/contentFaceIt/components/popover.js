import { EXTENSION_NAME } from '../../shared/constants';
import { getSyncStorage } from '../../shared/storage';
import { getColorToUse } from '../helpers/colorHelper';
import { getContentRoot } from '../helpers/matchroom';
import {
	getMapDictMemoized,
	getMapStats,
	loadMapStatsMemoized,
} from '../helpers/stats';
import { setColorOfElements } from './color';

export const createPopover = () => {
	const popoverDiv = document.createElement('div');
	const headingDiv = document.createElement('div');
	const mapDiv = document.createElement('div');
	const mapSpan = document.createElement('span');
	const timeFrameDiv = document.createElement('div');
	const timeFrameSpan = document.createElement('span');

	const rootElem = getContentRoot();

	popoverDiv.id = `${EXTENSION_NAME}-popover`;
	headingDiv.id = `${EXTENSION_NAME}-popover-heading`;

	popoverDiv.classList.add(`${EXTENSION_NAME}-popover`);
	headingDiv.classList.add(`${EXTENSION_NAME}-popover-heading`);
	mapDiv.classList.add(`${EXTENSION_NAME}-map`);
	timeFrameDiv.classList.add(`${EXTENSION_NAME}-time-frame`);

	popoverDiv.style.display = 'none';

	timeFrameDiv.append(timeFrameSpan);
	mapDiv.append(mapSpan);
	headingDiv.append(mapDiv, timeFrameDiv);
	popoverDiv.prepend(headingDiv);

	rootElem?.append(popoverDiv);
};

export const showPopover = async (_, parent, mapName, matchInfo) => {
	const rootElem = getContentRoot();
	const timeFrameName = getTimeFrameName();

	const contentContainer = rootElem.querySelector(
		`#${EXTENSION_NAME}-popover-content`
	);
	if (!contentContainer) {
		const matchRoomMaps = matchInfo.matchCustom?.tree?.map?.values?.value;
		const maps = getMapDictMemoized(matchInfo?.id, matchRoomMaps);
		const timeFrame = getSyncStorage('timeFrame');
		const usesCompareMode = getSyncStorage('usesCompareMode');
		const allStats = await loadMapStatsMemoized(
			`${matchInfo.id}-${timeFrame}-${usesCompareMode}`,
			matchInfo
		);
		const stats = getMapStats(mapName, maps, allStats, matchInfo);

		const popoverDiv = rootElem.querySelector(`#${EXTENSION_NAME}-popover`);
		const mapSpan = rootElem.querySelector(`.${EXTENSION_NAME}-map span`);
		const timeFrameSpan = rootElem.querySelector(
			`.${EXTENSION_NAME}-time-frame span`
		);

		const coordinates = parent.getBoundingClientRect() || {};
		const { x, y } = getPopoverAnchor(coordinates, stats);

		setPopoverActive(popoverDiv, x, y);

		mapSpan.textContent = stats[0]?.map || stats[1]?.map;
		timeFrameSpan.textContent = timeFrameName;

		const hasStats =
			Object.keys(stats?.[0] || {}).length > 1 ||
			(usesCompareMode && Object.keys(stats?.[1] || {}).length > 1);
		const contentDiv = document.createElement('div');

		contentDiv.id = `${EXTENSION_NAME}-popover-content`;

		if (hasStats) {
			if (!usesCompareMode) {
				const players = stats[0]?.players;
				if (players) {
					addPlayers(contentDiv, players, false);
				}
			} else {
				addCompareMode(contentDiv, stats);
			}
		} else {
			showNoData(contentDiv);
		}

		popoverDiv.append(contentDiv);
	}
};

export const hidePopover = () => {
	const rootElem = getContentRoot();
	const popover = rootElem?.querySelector(`#${EXTENSION_NAME}-popover`);

	popover.style.display = 'none';

	popover.querySelector(`#${EXTENSION_NAME}-popover-content`)?.remove();
};

const getTimeFrameName = () => {
	const timeFrame = getSyncStorage('timeFrame');
	const toggles = getSyncStorage('toggles');

	const toggle = toggles.find((x) => x.maxAge === timeFrame);

	return toggle?.name;
};

const getPopoverAnchor = ({ x, y }, stats) => {
	const team1 = stats?.[0]?.players;
	const team2 = stats?.[1]?.players;
	const playerCount = team1?.size > team2?.size ? team1?.size : team2?.size;
	const height = (playerCount * 53 + 20) / 2 + 24 - 25 ?? 20;

	return { x: x + 90, y: height ? y - height : y - 32 };
};

const setPopoverActive = (element, x, y) => {
	element.style.left = `${x}px`;
	element.style.top = `${y}px`;
	element.style.display = 'block';
};

const addPlayers = (parent, players, isCompact = false) => {
	for (const [player, playerStats] of players) {
		const playerDiv = document.createElement('div');
		const nameSpan = document.createElement('span');
		const matchesSpan = document.createElement('span');
		const winRateSpan = document.createElement('span');

		playerDiv.classList.add(
			`${EXTENSION_NAME}-player-div${isCompact ? '-compact' : ''}`
		);
		nameSpan.classList.add(
			`${EXTENSION_NAME}-player-name${isCompact ? '-compact' : ''}`
		);
		matchesSpan.classList.add(
			`${EXTENSION_NAME}-player-matches${isCompact ? '-compact' : ''}`
		);
		winRateSpan.classList.add(
			`${EXTENSION_NAME}-player-win-rate${isCompact ? '-compact' : ''}`
		);

		if (playerStats?.isCurrentUser) {
			nameSpan.style.cssText = 'color: #ff5500;';
		}

		nameSpan.textContent = `${player}`;
		matchesSpan.textContent = `${playerStats?.wins || 0}/${
			playerStats?.matches || 0
		}`;
		winRateSpan.textContent = `(${playerStats?.winRate || 0}%)`;

		if (!isCompact) {
			if (playerStats?.winRate || playerStats?.winRate === 0) {
				const elements = [{ element: winRateSpan, type: 'color' }];
				const colorToUse = getColorToUse(playerStats.winRate >= 50);

				setColorOfElements(colorToUse, elements);
			}
		}

		playerDiv.append(nameSpan, matchesSpan, winRateSpan);
		parent.append(playerDiv);
	}
};

const addCompareMode = (parent, stats) => {
	const isCompact = true;

	const statsDiv = document.createElement('div');
	statsDiv.classList.add(`${EXTENSION_NAME}-stats-div-compact`);

	for (const teamStats of stats) {
		const { matches, players, wins, winRate, ownTeamSide } =
			teamStats ?? {};
		const teamDiv = document.createElement('div');
		const teamStatsDiv = document.createElement('div');
		const nameSpan = document.createElement('span');
		const matchesSpan = document.createElement('span');
		const winRateSpan = document.createElement('span');

		teamStatsDiv.classList.add(`${EXTENSION_NAME}-team-div-compact`);
		nameSpan.classList.add(`${EXTENSION_NAME}-player-name-compact`);
		matchesSpan.classList.add(`${EXTENSION_NAME}-player-matches-compact`);
		winRateSpan.classList.add(`${EXTENSION_NAME}-player-win-rate-compact`);

		matchesSpan.textContent = `${wins || 0}/${matches || 0}`;
		winRateSpan.textContent = `(${winRate || 0}%)`;

		if (!isNaN(winRate)) {
			const elements = [{ element: winRateSpan, type: 'color' }];
			const isOwnTeamSide = !isNaN(ownTeamSide);
			const colorToUse = getColorToUse(winRate >= 50, isOwnTeamSide);

			setColorOfElements(colorToUse, elements);
		}

		if (players) {
			addPlayers(teamDiv, players, isCompact);
		}

		teamStatsDiv.append(nameSpan, matchesSpan, winRateSpan);
		teamDiv.prepend(teamStatsDiv);
		statsDiv.append(teamDiv);
	}

	parent.insertAdjacentElement('afterbegin', statsDiv);
};

const showNoData = (parent) => {
	const dataDiv = document.createElement('div');

	dataDiv.classList.add(`${EXTENSION_NAME}-popover-heading`);
	dataDiv.textContent = 'NO DATA';

	parent.append(dataDiv);
};
