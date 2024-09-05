import { getToggleInfo } from '../helpers/toggles';

export const initToggleButtons = (
    toggles,
    buttonGroupElem,
    activeToggleLabel = null
) => {
    for (const toggle of toggles) {
        const button = createButton(
            toggle.label,
            'toggle-btn',
            activeToggleLabel
        );

        buttonGroupElem.append(button);
    }
};

export const removeOldToggles = () => {
    const toggleGroupChildren = [
        ...document.getElementById('button-edit-group')?.children,
    ];
    toggleGroupChildren.forEach((toggle) => {
        if (toggle.classList.contains('toggle-btn')) {
            toggle.removeEventListener('click', clickHandler);
            toggle.remove();
        }
    });
};

export const updatePopupElements = (isDisabled, toggle = null) => {
    const timeFrameModalElem = document.getElementById('time-frame-modal');
    timeFrameModalElem.style.visibility = isDisabled ? 'hidden' : 'visible';

    if (toggle) {
        if (toggle?.type && toggle?.amount) {
            const timeFrameUnitBtns = [
                ...document.getElementById('time-frame-units')?.children,
            ];
            const timeFrameNumberBtns = [
                ...document.getElementById('time-frame-numbers')?.children,
            ];

            timeFrameUnitBtns.forEach((btn) => {
                if (btn.value === toggle.type) {
                    btn.classList.add('time-frame-btn-active');
                } else {
                    btn.classList.remove('time-frame-btn-active');
                }
            });

            timeFrameNumberBtns.forEach((btn) => {
                if (+btn.value === toggle.amount) {
                    btn.classList.add('time-frame-btn-active');
                } else {
                    btn.classList.remove('time-frame-btn-active');
                }
            });
        }
    }
};

const createButton = (label, cssClass, activeToggleLabel = null) => {
    const btnGroup = document.getElementById('button-edit-group');
    const button = document.createElement('button');

    button.classList.add(
        cssClass,
        ...(activeToggleLabel === label &&
        !hasClass(btnGroup, 'toggle-btn-active')
            ? ['toggle-btn-active']
            : [])
    );
    button.addEventListener('click', clickHandler);

    button.textContent = label;
    button.value = label;

    return button;
};

const clickHandler = (e) => {
    const activeButtons = document.querySelectorAll('.toggle-btn-active');

    if (e.currentTarget.classList.contains('toggle-btn-active')) {
        e.currentTarget.classList.remove('toggle-btn-active');

        updatePopupElements(true);
    } else {
        const toggle = getToggleInfo(e.currentTarget.value);

        for (const button of activeButtons) {
            button.classList.remove('toggle-btn-active');
        }
        e.currentTarget?.classList.add('toggle-btn-active');

        updatePopupElements(false, toggle);
    }
};

const hasClass = (parent, className) => !!parent.querySelector(`.${className}`);
