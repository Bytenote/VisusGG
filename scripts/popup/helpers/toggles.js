import { getSyncStorage } from '../../shared/storage';

export const getToggleInfo = (label) => {
	const toggles = getSyncStorage('toggles');

	if (toggles?.length > 0) {
		return toggles.find((toggle) => toggle.label === label);
	}
};
