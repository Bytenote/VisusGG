import { initStorage } from '../shared/storage';
import { setColorPickersColors } from './features/updateColorPicker';
import { setSwitchesValue } from './features/updateSwitches';
import { displayTimeFrameToggle } from './features/updateTimeFrameToggle';
import { initFormListeners } from './helpers/formListeners';
import { initStorageChangeListener } from './helpers/storageChanges';
import '@melloware/coloris/dist/coloris.css';

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
