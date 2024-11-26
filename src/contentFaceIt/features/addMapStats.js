import { getSyncStorage } from '../../shared/storage';
import { createPopover } from '../components/popover';
import { hydrateStats, insertStats } from '../components/winrate';
import {
    getMapObjects,
    getMatchRoomRoot,
    getStatsElements,
    hasStatsElements,
} from '../helpers/matchroom';
import {
    getMapDictMemoized,
    getMapStats,
    loadMapStatsMemoized,
} from '../helpers/stats';

export const addMapStats = async (matchInfo, siblingRoot) => {
    if (!getSyncStorage('usesFaceIt')) {
        return;
    }

    const idSuffix = siblingRoot ? '-1' : '-0';
    const matchRoomElem = getMatchRoomRoot(idSuffix, siblingRoot);
    const matchRoomMaps = matchInfo.matchCustom?.tree?.map?.values?.value;
    if (matchRoomElem && matchRoomMaps?.length > 0) {
        const mapElems = getMapObjects(
            idSuffix,
            matchRoomElem,
            matchInfo.id,
            matchRoomMaps
        );

        if (mapElems && mapElems.length > 0) {
            if (!hasStatsElements(matchRoomElem)) {
                mapElems.forEach(({ mapElem, mapName }) =>
                    insertStats(idSuffix, mapElem, mapName, matchInfo)
                );
                createPopover(idSuffix);
            }

            const timeFrame = getSyncStorage('timeFrame');
            const usesCompareMode = getSyncStorage('usesCompareMode');
            const stats = await loadMapStatsMemoized(
                `${matchInfo.id}-${timeFrame}-${usesCompareMode}`,
                matchInfo
            );
            const maps = getMapDictMemoized(matchInfo.id, matchRoomMaps);

            mapElems.forEach(({ mapElem, mapName }) => {
                const mapStats = getMapStats(mapName, maps, stats, matchInfo);
                hydrateStats(mapElem, mapStats);
            });
        }
    }

    return;
};

export const removeMapStats = (idSuffix) => {
    const matchRoomElem = getMatchRoomRoot(idSuffix);
    if (matchRoomElem) {
        const statsElems = getStatsElements(matchRoomElem);
        if (statsElems?.length > 0) {
            statsElems.forEach((elem) => {
                elem?.parentElement?.removeAttribute('style');
                elem?.remove();
            });
        }
    }
};
