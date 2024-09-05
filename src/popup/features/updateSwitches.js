import { getSyncStorage } from '../../shared/storage';
import { updateSwitchValue } from '../components/switch';

export const setSwitchesValue = () => {
    const SWITCHES = [
        { id: 'form-switch-input', key: 'usesCompareMode' },
        { id: 'toggle-faceit', key: 'usesFaceIt' },
        { id: 'toggle-steam', key: 'usesSteam' },
    ];
    SWITCHES.forEach(({ id, key }) => {
        setSwitchValue(key, id);
    });
};

export const setSwitchValue = (storageKey, id) => {
    const value = getSyncStorage(storageKey);
    const switchElem = document.querySelector(`#${id}`);

    updateSwitchValue(switchElem, value);
};
