import {
    DEFAULT_COLORS,
    DEFAULT_COMPARE_MODE,
    DEFAULT_FACEIT,
    DEFAULT_STEAM,
    DEFAULT_TOGGLES,
} from '../../shared/constants';
import {
    getSyncStorage,
    setStorage,
    setSyncStorage,
} from '../../shared/storage';
import { displaySnackbar } from '../components/snackbar';
import { getUpdatedColors } from './colorPickerHelpers';

export const submitHandler = async (e) => {
    e.preventDefault();

    const submitter = e.submitter?.name;
    if (submitter === 'reset') {
        resetSubmitter();

        displaySnackbar(e.target, 'Success');
    }
};

export const switchSubmitter = async (e, storageKey) => {
    const formElem = document.getElementById('form');

    await setStorage(storageKey, e.target.checked);

    displaySnackbar(formElem, 'Success');
};

export const colorPickerSubmitter = async (e) => {
    const formElem = document.getElementById('form');
    const updatedColors = getUpdatedColors(e.target, e.target.value);

    await setStorage('colors', updatedColors);
    setSyncStorage('colors', updatedColors);

    displaySnackbar(formElem, 'Success');
};

export const timeFrameSubmitter = async (amount, type, activeLabel) => {
    const formElem = document.getElementById('form');
    const toggles = getSyncStorage('toggles');

    const toggleIndex = toggles.findIndex(
        (toggle) => toggle.label === activeLabel
    );
    if (toggleIndex >= 0) {
        const newToggle = {
            label: `${amount}${type[0]}`,
            name: `${amount} ${
                amount > 1 ? type : type.slice(0, type.length - 1)
            }`,
            amount,
            type,
            maxAge: getAge(amount, type),
        };

        toggles[toggleIndex] = newToggle;
    }

    await setStorage(
        'toggles',
        toggles.sort((a, b) => a?.maxAge - b?.maxAge)
    );

    displaySnackbar(formElem, 'Success');
};

const resetSubmitter = async () => {
    await setStorage(
        'toggles',
        DEFAULT_TOGGLES.sort((a, b) => a?.maxAge - b?.maxAge)
    );
    await setStorage('usesCompareMode', DEFAULT_COMPARE_MODE);
    await setStorage('usesFaceIt', DEFAULT_FACEIT);
    await setStorage('usesSteam', DEFAULT_STEAM);
    setSyncStorage('colors', DEFAULT_COLORS);
};

const getAge = (amount, type) => {
    const defaultTime = 1000 * 60 * 60 * 24;
    const types = {
        days: defaultTime * amount,
        weeks: defaultTime * amount * 7,
        months: defaultTime * amount * 30,
        years: defaultTime * amount * 365,
    };

    return types[type];
};
