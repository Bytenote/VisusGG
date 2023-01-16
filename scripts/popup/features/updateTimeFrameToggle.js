import { EXTENSION_NAME } from '../../shared/constants';
import { getStorage, setSyncStorage } from '../../shared/storage';
import { initToggleButtons } from '../components/toggle';

export const displayTimeFrameToggle = async () => {
	const buttonGroupElem = document.getElementById(
		`${EXTENSION_NAME}-button-group`
	);

	const toggles = await getStorage('toggles');
	setSyncStorage('toggles', toggles);

	initToggleButtons(toggles, buttonGroupElem);
};
