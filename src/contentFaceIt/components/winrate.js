import { EXTENSION_NAME } from '../../shared/constants';
import { getColorToUse } from '../helpers/colorHelper';
import { setColorOfElements } from './color';
import { hidePopover, showPopover } from './popover';

export const insertStats = (idSuffix, mapElement, mapName, matchInfo) => {
    const statsDiv = document.createElement('div');
    const bar = document.createElement('span');
    const winRateDiv = document.createElement('div');
    const winRateText = document.createElement('div');
    const winRateInfo = document.createElement('div');

    statsDiv.classList.add(`${EXTENSION_NAME}-stats`);
    bar.classList.add(`${EXTENSION_NAME}-bar`);
    winRateDiv.classList.add(`${EXTENSION_NAME}-win-rate`);

    winRateText.textContent = '...%';

    function onMouseOver(e) {
        showPopover(e, idSuffix, statsDiv, mapName, matchInfo);
    }
    function onMouseOut(e) {
        hidePopover(e, idSuffix, statsDiv);
    }

    winRateInfo.style.fontSize = '0.57rem';

    statsDiv.removeEventListener('mouseover', onMouseOver);
    statsDiv.removeEventListener('mouseout', onMouseOut);

    statsDiv.addEventListener('mouseover', onMouseOver);
    statsDiv.addEventListener('mouseout', onMouseOut);

    winRateDiv.append(winRateText, winRateInfo);
    statsDiv.append(bar, winRateDiv);

    mapElement.insertAdjacentElement('afterbegin', statsDiv);
};

export const hydrateStats = (mapElement, stats) => {
    const bar = mapElement.querySelector(`.${EXTENSION_NAME}-bar`);
    const [winRateElem, winRateInfoElem] = mapElement.querySelector(
        `.${EXTENSION_NAME}-win-rate`
    ).children;

    const { winRate, winRateInfo, condition, winRateSymbol } =
        getModeSpecificDataToDisplay(stats);

    if (winRateInfoElem && winRateInfoElem.textContent !== winRateInfo) {
        winRateInfoElem.textContent = winRateInfo;
    }

    if (!isNaN(winRate)) {
        const elements = [
            { element: mapElement, type: 'background', opacity: 0.05 },
            { element: bar, type: 'background' },
            { element: winRateElem, type: 'color' },
        ];
        const colorToUse = getColorToUse(condition);
        setColorOfElements(colorToUse, elements);

        const displayValue = `${winRateSymbol + winRate}%`;
        if (
            winRateElem?.textContent &&
            winRateElem.textContent !== displayValue
        ) {
            winRateElem.textContent = displayValue;
        }
    } else {
        const displayValue = '---';
        if (
            winRateElem?.textContent &&
            winRateElem.textContent !== displayValue
        ) {
            mapElement.style.removeProperty('background');
            bar.style.removeProperty('background');
            winRateElem.style.removeProperty('color');
            winRateElem.textContent = displayValue;
        }
    }
};

const getModeSpecificDataToDisplay = (stats) => {
    let data = {
        winRate: 0,
        winRateInfo: '',
        condition: false,
        winRateSymbol: '',
    };

    if (stats?.length === 1) {
        data.winRate = stats[0]?.winRate;
        data.winRateInfo = 'Enemy Win %';
        data.condition = data.winRate >= 50;
    } else if (stats?.length === 2) {
        const ownTeamSide = stats[0]?.ownTeamSide === 0 ? 0 : 1;
        const opponentTeamSide = ownTeamSide === 0 ? 1 : 0;

        data.winRate =
            stats[ownTeamSide]?.winRate - stats[opponentTeamSide]?.winRate;
        data.winRateInfo = 'Win %';

        data.condition = data.winRate <= 0;
        data.winRateSymbol = data.winRate > 0 ? '+' : data.winRate === 0 && '±';
    }

    return data;
};
