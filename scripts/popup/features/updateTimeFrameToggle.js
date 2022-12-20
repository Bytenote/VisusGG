import { EXTENSION_NAME } from '../../shared/constants';
import { getStorage, setSyncStorage } from '../../shared/storage';
import {
	initToggleButtons,
	removeOldToggles,
	updatePopupElements,
} from '../components/toggle';

export const displayTimeFrameToggle = async () => {
	const buttonGroupElem = document.getElementById(
		`${EXTENSION_NAME}-button-group`
	);

	const toggles = await getStorage('toggles');
	setSyncStorage('toggles', toggles);

	initToggleButtons(toggles, buttonGroupElem);
};

export const updateTimeFrame = async (changes) => {
	if (changes?.toggles) {
		const toggles = await getStorage('toggles');
		setSyncStorage('toggles', toggles);

		updatePopupElements(true);
		removeOldToggles();

		await displayTimeFrameToggle();
	}
};
