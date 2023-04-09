import { EXTENSION_NAME } from '../../shared/constants';
import { getSyncStorage } from '../../shared/storage';
import { updateSwitchValue } from '../components/switch';

export const setSwitchValue = () => {
	const usesCompareMode = getSyncStorage('usesCompareMode');
	const switchElem = document.querySelector(
		`#${EXTENSION_NAME}-form-switch-input`
	);

	updateSwitchValue(switchElem, usesCompareMode);
};
