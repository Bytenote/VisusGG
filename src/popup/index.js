import '@melloware/coloris/dist/coloris.css';
import './styles.css';
import { displayTimeFrameToggle } from './features/updateTimeFrameToggle';
import { initStorage } from '../shared/storage';
import { initStorageChangeListener } from './helpers/storageChanges';
import { setSwitchesValue } from './features/updateSwitches';
import { setColorPickersColors } from './features/updateColorPicker';
import { initFormListeners } from './helpers/formListeners';

const initPopupElements = async () => {
	setSwitchesValue();
	setColorPickersColors();
	await displayTimeFrameToggle();

	initFormListeners();
};

(async () => {
	await initStorage();
	initStorageChangeListener();

	await initPopupElements();
})();
