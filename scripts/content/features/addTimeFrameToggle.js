import { getStorage, setSyncStorage } from '../../shared/storage';
import { insertTimeFrameToggle } from '../components/toggle';
import { getMatchInfo } from '../helpers/api';
import {
	getMapElements,
	getMatchRoomRoot,
	getRoomId,
	getToggleGroup,
	hasToggleElements,
	isPlayerOfMatch,
} from '../helpers/matchroom';
import { addMapStats } from './addMapStats';

export const addTimeFrameToggle = (parent, matchInfo) => {
	const matchRoomElem = parent?.getElementById('MATCHROOM-OVERVIEW');
	const matchRoomMaps = matchInfo.matchCustom?.tree?.map?.values?.value;

	if (matchRoomElem && matchRoomMaps?.length > 0) {
		if (!hasToggleElements(matchRoomElem)) {
			const mapElems = getMapElements(
				matchRoomElem,
				matchInfo.id,
				matchRoomMaps
			);

			if (mapElems && mapElems.length > 0) {
				const firstMapElem = mapElems[0].mapElem;
				insertTimeFrameToggle(firstMapElem);
			}
		}
	}

	return;
};

export const updateTimeFrame = async (changes) => {
	if (changes?.toggles) {
		const roomId = getRoomId();

		if (roomId) {
			const shadowElem = getMatchRoomRoot();
			const matchInfo = (await getMatchInfo(roomId)) ?? {};

			if (matchInfo && isPlayerOfMatch(matchInfo.teams)) {
				const toggles = await getStorage('toggles');
				const foundToggle =
					(await toggles.find(
						async (toggle) =>
							toggle.maxAge === (await getStorage('timeFrame'))
					)) || toggles[0];

				if (foundToggle) {
					setSyncStorage('timeFrame', foundToggle.maxAge);
				}
				setSyncStorage('toggles', toggles);

				removeTimeFrameToggle(shadowElem);
				addTimeFrameToggle(shadowElem, matchInfo);
				await addMapStats(shadowElem, matchInfo);
			}
		}
	}
};

const removeTimeFrameToggle = (parent) => {
	const matchRoomElem = parent?.getElementById('MATCHROOM-OVERVIEW');

	if (matchRoomElem) {
		if (hasToggleElements(matchRoomElem)) {
			const toggleGroup = getToggleGroup(matchRoomElem);

			toggleGroup.remove();
		}
	}
};
