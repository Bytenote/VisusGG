import {
	getAllMaps,
	getMapStats,
	loadMapStatsMemoized,
} from '../helpers/stats';
import {
	getMapElements,
	getMapName,
	hasStatsElements,
} from '../helpers/matchroom';
import { insertStats, updateStats } from '../components/winrate';
import { getSyncStorage } from '../../shared/storage';

export const addMapStats = async (parent, matchInfo) => {
	const matchRoomElem = parent?.getElementById('MATCHROOM-OVERVIEW');
	if (matchRoomElem) {
		const mapElems = getMapElements(matchRoomElem);

		if (mapElems) {
			if (!hasStatsElements(matchRoomElem)) {
				for (const elem in mapElems) {
					const mapElem = mapElems[elem];
					const mapName = getMapName(mapElem);

					if (mapName) {
						insertStats(mapElem);
					}
				}
			}

			const timeFrame = getSyncStorage('timeFrame');
			const mapStats = await loadMapStatsMemoized(
				`${matchInfo.id}-${timeFrame}`,
				matchInfo
			);
			const maps = getAllMaps(
				matchInfo.matchCustom?.tree?.map?.values?.value
			);

			for (const elem in mapElems) {
				const mapElem = mapElems[elem];
				const mapName = getMapName(mapElem);

				if (mapName) {
					const stats = getMapStats(mapName, maps, mapStats);

					updateStats(mapElem, stats);
				}
			}
		}
	}

	return;
};
