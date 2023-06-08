import { EXTENSION_NAME } from '../../shared/constants';
import { getColorToUse } from '../helpers/colorHelper';
import { setColorOfElements } from './color';
import { hidePopover, showPopover } from './popover';

export const insertStats = (mapElement, mapName, matchInfo) => {
	const statsDiv = document.createElement('div');
	const bar = document.createElement('span');
	const winRateDiv = document.createElement('div');
	const winRateText = document.createElement('span');

	statsDiv.classList.add(`${EXTENSION_NAME}-stats`);
	bar.classList.add(`${EXTENSION_NAME}-bar`);
	winRateDiv.classList.add(`${EXTENSION_NAME}-win-rate`);

	winRateText.textContent = '...%';

	function onMouseOver(e) {
		showPopover(e, statsDiv, mapName, matchInfo);
	}
	function onMouseOut(e) {
		hidePopover(e, statsDiv);
	}

	statsDiv.removeEventListener('mouseover', onMouseOver);
	statsDiv.removeEventListener('mouseout', onMouseOut);

	statsDiv.addEventListener('mouseover', onMouseOver);
	statsDiv.addEventListener('mouseout', onMouseOut);

	winRateDiv.append(winRateText);
	statsDiv.append(bar, winRateDiv);

	mapElement.insertAdjacentElement('afterbegin', statsDiv);
};

export const updateStats = (mapElement, stats) => {
	showWinRate(stats, mapElement);
};

const showWinRate = (stats, mapElement) => {
	const bar = mapElement.querySelector(`.${EXTENSION_NAME}-bar`);
	const winRateText = mapElement.querySelector(
		`.${EXTENSION_NAME}-win-rate`
	).firstChild;
	const { winRate, condition, winRateSymbol } =
		getModeSpecificDataToDisplay(stats);

	if (!isNaN(winRate)) {
		const elements = [
			{ element: mapElement, type: 'background', opacity: 0.05 },
			{ element: bar, type: 'background' },
			{ element: winRateText, type: 'color' },
		];
		const colorToUse = getColorToUse(condition);
		setColorOfElements(colorToUse, elements);

		const displayValue = `${winRateSymbol + winRate}%`;
		if (
			winRateText?.textContent &&
			winRateText.textContent !== displayValue
		) {
			winRateText.textContent = displayValue;
		}
	} else {
		const displayValue = '---';
		if (
			winRateText?.textContent &&
			winRateText.textContent !== displayValue
		) {
			mapElement.style.removeProperty('background');
			bar.style.removeProperty('background');
			winRateText.style.removeProperty('color');
			winRateText.textContent = displayValue;
		}
	}
};

const getModeSpecificDataToDisplay = (stats) => {
	let data = {
		winRate: 0,
		condition: false,
		winRateSymbol: '',
	};

	if (stats?.length === 1) {
		data.winRate = stats[0]?.winRate;
		data.condition = data.winRate >= 50;
	} else if (stats?.length === 2) {
		const ownTeamSide = stats[0]?.ownTeamSide === 0 ? 0 : 1;
		const opponentTeamSide = ownTeamSide === 0 ? 1 : 0;

		data.winRate =
			stats[ownTeamSide]?.winRate - stats[opponentTeamSide]?.winRate;
		data.condition = data.winRate <= 0;
		data.winRateSymbol = data.winRate > 0 ? '+' : data.winRate === 0 && '±';
	}

	return data;
};
