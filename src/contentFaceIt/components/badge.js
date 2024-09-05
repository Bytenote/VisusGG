import { EXTENSION_NAME } from '../../shared/constants';

export const insertCreatorBadge = (parent) => {
    const badgeDiv = document.createElement('div');

    badgeDiv.setAttribute('id', `${EXTENSION_NAME}-badge`);
    badgeDiv.textContent = `${EXTENSION_NAME} CREATOR`;

    parent.insertAdjacentElement('afterbegin', badgeDiv);
};
