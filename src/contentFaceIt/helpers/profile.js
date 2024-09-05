import { CREATORS, EXTENSION_NAME } from '../../shared/constants';
import {
    findElementRecursively,
    getDirectChildTextContent,
    getOptimizedElement,
    getSameParentElement,
} from './utils';

export const isCreatorProfile = () => {
    const urlName = getPlayerUrlName();

    return CREATORS.includes(urlName) ? urlName : null;
};

export const getBannerRoot = () =>
    document.querySelector('.modal-content parasite-player-profile') ||
    document.getElementById('parasite-container');

export const getBannerPlayerCard = (parent) => {
    const bannerOptimized = getOptimizedElement('profile-banner', () => {
        const avatarElem = getAvatar(parent);
        if (avatarElem) {
            const playerNameElem = findPlayerNameElement(parent);
            const parentElem = getSameParentElement(avatarElem, playerNameElem);

            return parentElem;
        }

        return null;
    });

    return bannerOptimized;
};

export const hasCreatorElement = (bannerElem) =>
    !!bannerElem.querySelector(`#${EXTENSION_NAME}-badge`);

const getAvatar = (parent) =>
    parent?.querySelector('i[data-testid="avatar"]') ||
    parent?.querySelector('img[aria-label="avatar"]');

const findPlayerNameElement = (parent) => {
    const urlName = getPlayerUrlName();
    const playerName = findElementRecursively([parent], (elem) => {
        const textContent = getDirectChildTextContent(elem);

        return textContent === urlName;
    });

    return playerName;
};

const getPlayerUrlName = () => {
    const [_, profile] =
        /players(?:-modal)?\/([^/]+)/.exec(location.pathname) ?? [];

    return profile;
};
