import {
	getMapDictMemoized,
	getMapStats,
	loadMapStatsMemoized,
} from '../helpers/stats';
import {
	getMapElements,
	getMatchRoomRoot,
	hasStatsElements,
} from '../helpers/matchroom';
import { insertStats, hydrateStats } from '../components/winrate';
import { getSyncStorage } from '../../shared/storage';
import { createPopover } from '../components/popover';

export const addMapStats = async (matchInfo) => {
	if (!getSyncStorage('usesFaceIt')) {
		return;
	}

	const matchRoomElem = getMatchRoomRoot();
	const matchRoomMaps = matchInfo.matchCustom?.tree?.map?.values?.value;
	if (matchRoomElem && matchRoomMaps?.length > 0) {
		const mapElems = getMapElements(
			matchRoomElem,
			matchInfo.id,
			matchRoomMaps
		);

		if (mapElems && mapElems.length > 0) {
			if (!hasStatsElements(matchRoomElem)) {
				mapElems.forEach(({ mapElem, mapName }) =>
					insertStats(mapElem, mapName, matchInfo)
				);
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
				hydrateStats(mapElem, mapStats);
			});
		}
	}

	return;
};

export const removeMapStats = () => {
	const matchRoomElem = getMatchRoomRoot();
	if (matchRoomElem) {
		if (hasStatsElements(matchRoomElem)) {
			const statsElems = [
				...matchRoomElem.querySelectorAll('.VisusGG-stats'),
			];

			statsElems?.forEach((elem) => {
				elem?.parentElement?.removeAttribute('style');
				elem?.remove();
			});
		}
	}
};
