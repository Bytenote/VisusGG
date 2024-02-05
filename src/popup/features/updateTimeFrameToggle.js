import { getStorage, setSyncStorage } from '../../shared/storage';
import { initToggleButtons } from '../components/toggle';

export const displayTimeFrameToggle = async (activeToggleLabel = null) => {
	const buttonGroupElem = document.getElementById('button-edit-group');

	const toggles = await getStorage('toggles');
	setSyncStorage('toggles', toggles);

	initToggleButtons(toggles, buttonGroupElem, activeToggleLabel);
};
