import { getLoggedInUserInfo } from '../../shared/helpers/api';
import { getSyncStorage, setSyncStorage } from '../../shared/storage';
import { isJson } from './utils';

export const getCurrentUserId = () => {
    try {
        const legacyId = JSON.parse(
            localStorage.getItem('C_UCURRENT_USER.data.CURRENT_USER')
        )?.value?.currentUser?.id;
        if (legacyId) {
            return legacyId;
        }
    } catch (error) {}

    try {
        const auth = JSON.parse(localStorage.getItem('prefetched-auth'));
        if (auth) {
            return auth?.session?.entity?.id;
        }
    } catch (error) {}

    for (const key in localStorage) {
        if (!key.includes('ab.storage.')) {
            continue;
        }

        let id = null;
        try {
            if (key.includes('ab.storage.userId.')) {
                id = JSON.parse(localStorage.getItem(key))?.v?.g;
            } else if (key.includes('ab.storage.attributes.')) {
                id = Object.keys(
                    JSON.parse(localStorage.getItem(key))?.v || {}
                )?.[0];
            } else if (key.includes('ab.storage.events.')) {
                id = JSON.parse(localStorage.getItem(key))?.v?.[0]?.u;
            }
        } catch (error) {
            continue;
        }

        if (id) {
            return id;
        }
    }

    const cookieUserId = _getUserIdFromCookies();
    if (cookieUserId) {
        return cookieUserId;
    }

    const storedUserId = getSyncStorage('userId');
    if (storedUserId) {
        const [storedId] = storedUserId.split('::');

        return storedId;
    }

    return null;
};

const requestNewUserId = async () => {
    const user = await getLoggedInUserInfo();

    const newTimestamp = Math.floor(Date.now() / 1_000);
    setSyncStorage('userId', `${user?.id ?? ''}::${newTimestamp}`);

    return user?.id;
};

const getUserIdFromExtStorage = async () => {
    const userId = getSyncStorage('userId');
    if (!userId) {
        return await requestNewUserId();
    }

    const [storedUserId, storedTimestamp] = userId.split('::');

    if (!storedTimestamp) {
        return await requestNewUserId();
    }

    const currentTimestamp = Math.floor(Date.now() / 1_000);
    const timeDiff = currentTimestamp - parseInt(storedTimestamp, 10);
    if (storedUserId) {
        if (timeDiff <= 60 * 60 * 24 * 3) {
            return storedUserId;
        }
    }

    if (timeDiff > 120) {
        return await requestNewUserId();
    }

    return storedUserId;
};

export const isLoggedIn = async () => {
    const storedUserId = await getUserIdFromExtStorage();
    if (storedUserId) {
        return true;
    }

    const hasCookie = document.cookie.includes(' ab.storage.userId.');

    return hasCookie || !!getCurrentUserId();
};

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
