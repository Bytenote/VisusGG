import { EXTENSION_NAME } from '../../shared/constants';
import { getSyncStorage } from '../../shared/storage';
import { getMatchroomRoot } from '../helpers/matchroom';

export const showPopover = (e, parent, stats) => {
	hidePopover();

	const shadow = getMatchroomRoot();
	const timeFrameName = getTimeFrameName();

	const popoverDiv = document.createElement('div');
	const headingDiv = document.createElement('div');
	const mapDiv = document.createElement('div');
	const mapSpan = document.createElement('span');
	const timeFrameDiv = document.createElement('div');
	const timeFrameSpan = document.createElement('span');

	const coordinates = parent.getBoundingClientRect() || {};
	const { x, y } = getPopoverAnchor(coordinates, stats);

	popoverDiv.classList.add(`${EXTENSION_NAME}-popover`);
	headingDiv.classList.add(`${EXTENSION_NAME}-popover-heading`);
	mapDiv.classList.add(`${EXTENSION_NAME}-map`);
	timeFrameDiv.classList.add(`${EXTENSION_NAME}-time-frame`);

	popoverDiv.style.left = `${x}px`;
	popoverDiv.style.top = `${y}px`;

	mapSpan.textContent = stats?.map;
	timeFrameSpan.textContent = timeFrameName;

	timeFrameDiv.append(timeFrameSpan);
	mapDiv.append(mapSpan);
	headingDiv.append(mapDiv, timeFrameDiv);
	popoverDiv.prepend(headingDiv);

	if (!shadow.querySelector(`.${EXTENSION_NAME}-popover`)) {
		if (stats) {
			addPlayers(popoverDiv, stats);
		} else {
			const dataDiv = document.createElement('div');

			dataDiv.classList.add(`${EXTENSION_NAME}-popover-heading`);
			dataDiv.textContent = 'NO DATA';

			popoverDiv.append(dataDiv);
		}
	}

	shadow?.appendChild(popoverDiv);
};

export const hidePopover = () => {
	const popover = getMatchroomRoot().querySelector(
		`div.${EXTENSION_NAME}-popover`
	);

	popover?.remove();
};

const getTimeFrameName = () => {
	const timeFrame = getSyncStorage('timeFrame');
	const toggles = getSyncStorage('toggles');

	const toggle = toggles.find((x) => x.maxAge === timeFrame);

	return toggle?.name;
};

const getPopoverAnchor = ({ x, y }, stats) => {
	const playerCount = stats?.playerArr?.length;
	const height = (playerCount * 53 + 20) / 2 + 24 - 25 ?? 20;

	return { x: x + 60, y: height ? y - height : y - 32 };
};

const addPlayers = (popoverDiv, stats) => {
	for (const player of stats.playerArr) {
		const playerStats = stats.players?.[player];
		const playerDiv = document.createElement('div');
		const nameSpan = document.createElement('span');
		const matchesSpan = document.createElement('span');
		const winRateSpan = document.createElement('span');

		playerDiv.classList.add(`${EXTENSION_NAME}-player-div`);
		nameSpan.classList.add(`${EXTENSION_NAME}-player-name`);
		matchesSpan.classList.add(`${EXTENSION_NAME}-player-matches`);
		winRateSpan.classList.add(`${EXTENSION_NAME}-player-win-rate`);

		nameSpan.textContent = `${player}`;
		matchesSpan.textContent = `${playerStats?.wins || 0}/${
			playerStats?.matches || 0
		}`;
		winRateSpan.textContent = `(${playerStats?.winRate || 0}%)`;

		if (playerStats?.winRate || playerStats?.winRate === 0) {
			if (playerStats.winRate < 50) {
				winRateSpan.style.cssText = 'color: rgb(0, 153, 51)';
			} else {
				winRateSpan.style.cssText = 'color: rgb(230, 0, 0)';
			}
		}

		playerDiv.append(nameSpan, matchesSpan, winRateSpan);
		popoverDiv.append(playerDiv);
	}
};
