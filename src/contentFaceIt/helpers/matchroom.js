import { EXTENSION_NAME } from '../../shared/constants';
import { getMapDictMemoized } from './stats';
import {
    findElementRecursively,
    getDirectChildTextContent,
    getOptimizedElement,
} from './utils';

export const getRoomId = (path = location.pathname) =>
    /room\/([0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+(?:-[0-9a-z]+)?)/.exec(
        path
    )?.[1] || null;

export const getContentRoot = () =>
    document.getElementById('parasite-container') ??
    document.getElementById('main-layout-content');

export const getMatchRoomRoot = () =>
    document.getElementById('MATCHROOM-OVERVIEW') ??
    getOptimizedElement('MATCHROOM-OVERVIEW', () =>
        document.querySelector('[id*="MATCHROOM-OVERVIEW-"]')
    );

export const getMapObjects = (
    matchRoomElem,
    matchRoomId,
    matchRoomMaps = []
) => {
    const mapDict = getMapDictMemoized(matchRoomId, matchRoomMaps);
    const matchRoomInfoColumn = getOptimizedElement(
        'matchroom-info-column',
        () => matchRoomElem.querySelector("div > div[name='info']")
    );

    const knownMapObjects = getKnownMapObjects(
        matchRoomInfoColumn ?? matchRoomElem
    );
    if (knownMapObjects.length > 0) {
        return knownMapObjects;
    }

    if (matchRoomElem) {
        const potentialMapElems = findPotentialMapElements(
            matchRoomInfoColumn,
            matchRoomElem,
            matchRoomMaps
        );

        const mapObjects = (potentialMapElems ?? [])
            .reduce((acc, mapElem) => {
                let mapName = '';

                if (
                    mapElem?.querySelector('div.startSlot') &&
                    mapElem.querySelector('div.middleSlot')
                ) {
                    mapName = getMapNameFromElement(
                        mapElem.querySelector('div.middleSlot'),
                        mapDict
                    );
                } else {
                    const useDirectChild = true;
                    mapName = findElementRecursively(
                        [mapElem, mapDict, useDirectChild],
                        getMapNameFromElement
                    )?.textContent;

                    console.info(`[${EXTENSION_NAME}]: Using backup map name`);
                }

                if (mapName) {
                    acc.push({
                        mapElem,
                        mapName,
                    });
                }

                return acc;
            }, [])
            .map(({ mapElem, mapName }, i) => {
                const attr = `${EXTENSION_NAME}-map-${i}`;
                const attrType = mapElem.hasAttribute('id')
                    ? `data-${EXTENSION_NAME}`
                    : 'id';

                const isKnownMapElem = mapElem.getAttribute(attrType) === attr;
                if (!isKnownMapElem) {
                    mapElem.setAttribute(attrType, attr);
                    mapElem.setAttribute(`data-${EXTENSION_NAME}-map`, mapName);
                }

                return {
                    mapElem,
                    mapName,
                };
            });

        return mapObjects;
    }
};

export const hasStatsElements = (parent) =>
    [...parent.querySelectorAll(`div.${EXTENSION_NAME}-stats`)].length > 0;

export const getStatsElements = (parent) => [
    ...parent.querySelectorAll(`div.${EXTENSION_NAME}-stats`),
];

export const hasToggleElements = (parent) =>
    !!parent.querySelector(`#${EXTENSION_NAME}-button-group`);

export const getToggleGroup = (parent) =>
    parent.querySelector(`#${EXTENSION_NAME}-button-group`);

const getKnownMapObjects = (container) => {
    const mapObjects = [];

    let i = 0;
    while (true) {
        const attr = `${EXTENSION_NAME}-map-${i}`;
        const mapElem =
            document.getElementById(attr) ??
            container.querySelector(`[data-${EXTENSION_NAME}="${attr}"]`);
        if (mapElem) {
            mapObjects.push({
                mapElem,
                mapName: mapElem.getAttribute(`data-${EXTENSION_NAME}-map`),
            });
        } else break;

        i++;
    }

    return mapObjects;
};

const findPotentialMapElements = (
    container,
    containerBackup,
    matchRoomMaps
) => {
    const parent = container ?? containerBackup;

    const mapElems1 = [
        ...(parent.querySelectorAll('[data-testid=matchPreference]') ?? []),
    ];
    if (mapElems1?.length > 0) {
        return mapElems1;
    }

    const mapElems2 = [...(parent?.querySelectorAll('div.endSlot') ?? [])].map(
        (x) => x?.parentElement?.parentElement
    );
    if (mapElems2?.length > 0) {
        return mapElems2;
    }

    const mapElems3 = findMapElementsByImageSrc(containerBackup, matchRoomMaps);
    if (mapElems3?.length > 0) {
        console.info(`[${EXTENSION_NAME}]: Using backup map elements`);

        return mapElems3;
    }
};

const findMapElementsByImageSrc = (container, matchRoomMaps) =>
    matchRoomMaps.reduce((maps, map) => {
        const mapElem =
            container.querySelector(`div[src="${map.image_sm}"]`)?.parentElement
                ?.parentElement?.parentElement ??
            container.querySelector(`div[src="${map.image_lg}"]`)?.parentElement
                ?.parentElement?.parentElement;
        if (mapElem) {
            maps.push(mapElem);
        }

        return maps;
    }, []);

const getMapNameFromElement = (elem, mapDict, useDirectChild = false) => {
    let textContent = elem.textContent.trim();
    if (useDirectChild) {
        textContent = getDirectChildTextContent(elem);
    }

    const mapNames = mapDict[textContent];
    if (mapNames) {
        return (
            mapNames.class_name ||
            mapNames.name ||
            mapNames.guid ||
            mapNames.game_map_id
        );
    }
};
