import { EXTENSION_NAME } from '../../shared/constants';
import { hidePopover, showPopover } from './popover';

export const insertStats = (mapElement) => {
	const statsDiv = document.createElement('div');
	const bar = document.createElement('span');
	const winRateDiv = document.createElement('div');
	const winRateText = document.createElement('span');

	statsDiv.classList.add(`${EXTENSION_NAME}-stats`);
	bar.classList.add(`${EXTENSION_NAME}-bar`);
	winRateDiv.classList.add(`${EXTENSION_NAME}-win-rate`);

	winRateText.textContent = '...%';

	winRateDiv.append(winRateText);
	statsDiv.append(bar, winRateDiv);

	mapElement.insertAdjacentElement('afterbegin', statsDiv);
};

export const updateStats = (mapElement, stats) => {
	const statsDiv = mapElement.querySelector(`.${EXTENSION_NAME}-stats`);

	if (statsDiv) {
		const bar = mapElement.querySelector(`.${EXTENSION_NAME}-bar`);
		const winRateText = mapElement.querySelector(
			`.${EXTENSION_NAME}-win-rate`
		).firstChild;

		statsDiv.addEventListener('mouseenter', (e) =>
			showPopover(e, statsDiv, stats)
		);
		statsDiv.addEventListener('mouseleave', (e) => hidePopover(e));

		if (stats) {
			if (stats.winRate < 50) {
				mapElement.style.cssText = 'background: rgb(0, 153, 51, 0.05)';
				bar.style.cssText = 'background: rgb(0, 153, 51)';
				winRateText.style.cssText = 'color: rgb(0, 153, 51)';
			} else {
				mapElement.style.cssText = 'background: rgb(230, 0, 0, 0.05)';
				bar.style.cssText = 'background: rgb(230, 0, 0)';
				winRateText.style.cssText = 'color: rgb(230, 0, 0)';
			}

			winRateText.textContent = `${stats.winRate}%`;
		} else {
			mapElement.style.removeProperty('background');
			bar.style.removeProperty('background');
			winRateText.style.removeProperty('color');

			winRateText.textContent = '---';
		}
	}
};
