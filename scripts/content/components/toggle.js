import { EXTENSION_NAME } from '../../shared/constants';
import { addMapStats } from '../features/addMapStats';
import { getMatchInfo } from '../helpers/api';
import { getSyncStorage, setSyncStorage } from '../../shared/storage';
import { getMatchRoomRoot, getRoomId } from '../helpers/matchroom';

export const insertTimeFrameToggle = (parent) => {
	const buttonGroup = document.createElement('div');
	const toggles = getSyncStorage('toggles');

	buttonGroup.setAttribute('id', `${EXTENSION_NAME}-button-group`);

	for (const toggle of toggles) {
		const button = createButton(toggle.label, toggle.maxAge);

		buttonGroup.append(button);
	}

	setActiveToggle(buttonGroup, toggles);

	parent.insertAdjacentElement('beforebegin', buttonGroup);
};

const createButton = (label, maxAge) => {
	const button = document.createElement('button');

	button.classList.add(`${EXTENSION_NAME}-toggle`);
	button.addEventListener('click', (e) => clickHandler(e, maxAge));

	button.textContent = label;

	return button;
};

const clickHandler = (e, maxAge) => {
	const activeButtons = getMatchRoomRoot().querySelectorAll(
		`.${EXTENSION_NAME}-toggle-active`
	);

	for (const button of activeButtons) {
		button.classList.remove(`${EXTENSION_NAME}-toggle-active`);
	}
	e.currentTarget?.classList.add(`${EXTENSION_NAME}-toggle-active`);

	setSyncStorage('timeFrame', maxAge);
	updateStats();
};

const setActiveToggle = (buttonGroup, toggles) => {
	const activeToggle =
		toggles.find(
			(toggle) => toggle.maxAge === getSyncStorage('timeFrame')
		) || toggles?.[0];
	if (activeToggle) {
		const activeButton = [...buttonGroup.children]?.find(
			(button) => button.textContent === activeToggle.label
		);

		activeButton?.classList.add(`${EXTENSION_NAME}-toggle-active`);
	}
};

const updateStats = async () => {
	const matchInfo = await getMatchInfo(getRoomId());

	addMapStats(getMatchRoomRoot(), matchInfo);
};
