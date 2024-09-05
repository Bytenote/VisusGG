import browser from 'webextension-polyfill';
import { DEFAULT_STORAGE } from './constants';

const syncStorage = new Map();

export const initStorage = async () => {
    let storage = await getAllStorage();

    if (!hasAllStorageProps(storage)) {
        const storagePromises = DEFAULT_STORAGE.map(({ key }) =>
            getStorage(key)
        );
        const storageProps = await Promise.all(storagePromises);

        const setterPromises = storageProps.map((value, index) => {
            if (!value) {
                const { key, value } = DEFAULT_STORAGE[index];

                return setStorage(key, value);
            }

            return true;
        });
        await Promise.all(setterPromises);

        storage = await getAllStorage();
    }

    if (syncStorage.size < 1) {
        Object.entries(storage).forEach(([key, value]) =>
            setSyncStorage(key, value)
        );
    }
};

export const getSyncStorage = (key) => {
    const sto = syncStorage.get(key);

    if (sto && key === 'toggles') {
        return sto.sort((a, b) => a?.maxAge - b?.maxAge);
    }

    return sto;
};

export const setSyncStorage = (key, val) => {
    syncStorage.set(key, val);
    setStorage(key, val);
};

export const setStorage = (key, val) =>
    new Promise((resolve) => {
        browser.storage.local
            .set({ [key]: val })
            .then(async () => resolve(true))
            .catch((err) => {
                console.log(err);
                resolve(false);
            });
    });

export const getStorage = (key) =>
    new Promise((resolve) => {
        browser.storage.local
            .get(key)
            .then((res) => resolve(key === null ? res : res?.[key]))
            .catch((err) => {
                console.log(err);
                resolve(false);
            });
    });

export const clearStorage = () =>
    new Promise((resolve) => {
        browser.storage.local
            .clear()
            .then(() => resolve(true))
            .catch((err) => {
                console.log(err);
                resolve(false);
            });
    });

const getAllStorage = async () => await getStorage(null);

const hasAllStorageProps = (storage) =>
    storage &&
    typeof storage === 'object' &&
    Object.keys(storage)?.length === DEFAULT_STORAGE.length;
