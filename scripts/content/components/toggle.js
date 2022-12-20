import { EXTENSION_NAME } from '../../shared/constants';
import { addMapStats } from '../features/addMapStats';
import { getMatchInfo } from '../helpers/api';
import { getSyncStorage, setSyncStorage } from '../../shared/storage';
import { getMatchroomRoot, getRoomId } from '../helpers/matchroom';

export const insertTimeFrameToggle = (parent) => {
	const buttonGroup = document.createElement('div');
	const toggles = getSyncStorage('toggles');

	buttonGroup.setAttribute('id', `${EXTENSION_NAME}-button-group`);

	for (const toggle of toggles) {
		const button = createButton(toggle.label, toggle.maxAge);

		buttonGroup.append(button);
	}

	parent.insertAdjacentElement('beforebegin', buttonGroup);
};

const createButton = (label, maxAge) => {
	const button = document.createElement('button');
	const isActive = getSyncStorage('timeFrame') === maxAge;

	button.classList.add(`${EXTENSION_NAME}-toggle`);
	button.addEventListener('click', (e) => clickHandler(e, maxAge));

	button.textContent = label;

	if (isActive) {
		button.classList.add(`${EXTENSION_NAME}-toggle-active`);
	}

	return button;
};

const clickHandler = (e, maxAge) => {
	const activeButtons = getMatchroomRoot().querySelectorAll(
		`.${EXTENSION_NAME}-toggle-active`
	);

	for (const button of activeButtons) {
		button.classList.remove(`${EXTENSION_NAME}-toggle-active`);
	}
	e.currentTarget?.classList.add(`${EXTENSION_NAME}-toggle-active`);

	setSyncStorage('timeFrame', maxAge);
	updateStats();
};

const updateStats = async () => {
	const matchInfo = await getMatchInfo(getRoomId());

	addMapStats(getMatchroomRoot(), matchInfo);
};
