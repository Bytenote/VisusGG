import { isJson } from './utils';

export const getCurrentUserId = () => {
    const legacyId = JSON.parse(
        localStorage.getItem('C_UCURRENT_USER.data.CURRENT_USER')
    )?.value?.currentUser?.id;
    if (legacyId) {
        return legacyId;
    }

    const auth = JSON.parse(localStorage.getItem('prefetched-auth'));
    if (auth) {
        return auth?.session?.entity?.id;
    }

    for (const key in localStorage) {
        const isId1 = key.includes('ab.storage.userId.');
        const isId2 = key.includes('ab.storage.attributes.');
        const isId3 = key.includes('ab.storage.events.');
        let id = null;

        if (isId1) {
            id = JSON.parse(localStorage[key])?.v?.g;
        } else if (isId2) {
            id = Object.keys(JSON.parse(localStorage[key])?.v || {})?.[0];
        } else if (isId3) {
            id = JSON.parse(localStorage[key])?.v?.[0]?.u;
        }

        if (id) {
            return id;
        }
    }

    const cookieUserId = _getUserIdFromCookies();
    if (cookieUserId) {
        return cookieUserId;
    }

    return null;
};

export const isLoggedIn = () =>
    document.cookie.includes(' ab.storage.userId.') || !!getCurrentUserId();

const _getUserIdFromCookies = () => {
    const cookies = document.cookie.split(';');
    const cookieContent = cookies
        .find((cookie) => cookie?.trim()?.startsWith('ab.storage.userId'))
        ?.split('=')?.[1];
    if (cookieContent) {
        if (isJson(cookieContent)) {
            return JSON.parse(decodeURIComponent(cookieContent))?.g;
        }

        const cookieValue = decodeURIComponent(cookieContent);
        const cookieValueParts = cookieValue.split('|');
        const userIdValue = cookieValueParts.find((part) =>
            part.startsWith('g:')
        );
        if (userIdValue) {
            return userIdValue.split(':')[1];
        }
    }
};
