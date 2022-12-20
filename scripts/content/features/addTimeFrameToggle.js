import { getStorage, setSyncStorage } from '../../shared/storage';
import { insertTimeFrameToggle } from '../components/toggle';
import { getMatchInfo } from '../helpers/api';
import {
	getMapElements,
	getMatchroomRoot,
	getRoomId,
	getToggleGroup,
	hasToggleElements,
	isPlayerOfMatch,
} from '../helpers/matchroom';

export const addTimeFrameToggle = (parent) => {
	const matchRoomElem = parent?.getElementById('MATCHROOM-OVERVIEW');
	if (matchRoomElem) {
		if (!hasToggleElements(matchRoomElem)) {
			const mapElems = getMapElements(matchRoomElem);

			if (mapElems && mapElems.length > 0) {
				insertTimeFrameToggle(mapElems[0]);
			}
		}
	}

	return;
};

export const updateTimeFrame = async (changes) => {
	if (changes?.toggles) {
		const roomId = getRoomId();
		if (roomId) {
			const shadowElem = getMatchroomRoot();
			const matchInfo = (await getMatchInfo(roomId)) ?? {};
			if (matchInfo && isPlayerOfMatch(matchInfo.teams)) {
				const toggles = await getStorage('toggles');
				setSyncStorage('toggles', toggles);

				removeTimeFrameToggle(shadowElem);
				addTimeFrameToggle(
					shadowElem,
					matchInfo.state,
					matchInfo.matchCustom
				);
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
