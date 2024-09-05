import {
    colorPickerInputHandler,
    getColorPickerElements,
} from './colorPickerHelpers';
import {
    colorPickerSubmitter,
    submitHandler,
    switchSubmitter,
} from './submitters';
import { onTimeFrameNumberClick, onTimeFrameUnitClick } from './toggles';

export const initFormListeners = () => {
    const colorPickerElem = getColorPickerElements();
    const ELEMS = [
        {
            id: 'form-switch-input',
            event: 'change',
            handler: onCompareModeChange,
        },
        { id: 'toggle-faceit', event: 'change', handler: onFaceItChange },
        { id: 'toggle-steam', event: 'change', handler: onSteamChange },
        { id: 'form', event: 'submit', handler: submitHandler },
    ];
    const timeFrameUnitBtns = [
        ...document.getElementById('time-frame-units')?.children,
    ];
    const timeFrameNumberBtns = [
        ...document.getElementById('time-frame-numbers')?.children,
    ];

    for (const elem of colorPickerElem) {
        elem.addEventListener('input', colorPickerInputHandler);
        elem.addEventListener('change', colorPickerSubmitter);
    }

    ELEMS.forEach(({ id, event, handler }) => {
        const elem = document.querySelector(`#${id}`);
        elem?.addEventListener(event, handler);
    });

    timeFrameUnitBtns.forEach((btn) => {
        btn.addEventListener('click', onTimeFrameUnitClick);
    });
    timeFrameNumberBtns.forEach((btn) => {
        btn.addEventListener('click', onTimeFrameNumberClick);
    });
};

const onCompareModeChange = (e) => {
    switchSubmitter(e, 'usesCompareMode');
};

const onFaceItChange = (e) => {
    switchSubmitter(e, 'usesFaceIt');
};

const onSteamChange = (e) => {
    switchSubmitter(e, 'usesSteam');
};
