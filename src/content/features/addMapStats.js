import {
	getMapDictMemoized,
	getMapStats,
	loadMapStatsMemoized,
} from '../helpers/stats';
import { getMapElements, hasStatsElements } from '../helpers/matchroom';
import { insertStats, updateStats } from '../components/winrate';
import { getSyncStorage } from '../../shared/storage';
import { createPopover } from '../components/popover';

export const addMapStats = async (parent, matchInfo) => {
	const matchRoomElem = parent?.getElementById('MATCHROOM-OVERVIEW');
	const matchRoomMaps = matchInfo.matchCustom?.tree?.map?.values?.value;

	if (matchRoomElem && matchRoomMaps?.length > 0) {
		const mapElems = getMapElements(
			matchRoomElem,
			matchInfo.id,
			matchRoomMaps
		);

		if (mapElems && mapElems.length > 0) {
			if (!hasStatsElements(matchRoomElem)) {
				mapElems.forEach(({ mapElem }) => insertStats(mapElem));

				createPopover();
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
				updateStats(mapElem, mapStats);
			});
		}
	}

	return;
};
