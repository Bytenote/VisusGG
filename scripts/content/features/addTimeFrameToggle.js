import { insertTimeFrameToggle } from '../components/toggle';
import {
	getMapElements,
	getToggleGroup,
	hasToggleElements,
} from '../helpers/matchroom';

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

export const removeTimeFrameToggle = (parent) => {
	const matchRoomElem = parent?.getElementById('MATCHROOM-OVERVIEW');

	if (matchRoomElem) {
		if (hasToggleElements(matchRoomElem)) {
			const toggleGroup = getToggleGroup(matchRoomElem);

			toggleGroup.remove();
		}
	}
};
