import { getSyncStorage } from '../../shared/storage';
import { insertTimeFrameToggle } from '../components/toggle';
import {
    getMapObjects,
    getMatchRoomRoot,
    getToggleGroup,
    hasToggleElements,
} from '../helpers/matchroom';

export const addTimeFrameToggle = (matchInfo) => {
    if (!getSyncStorage('usesFaceIt')) {
        return;
    }

    const matchRoomElem = getMatchRoomRoot();
    const matchRoomMaps = matchInfo.matchCustom?.tree?.map?.values?.value;
    if (matchRoomElem && matchRoomMaps?.length > 0) {
        if (!hasToggleElements(matchRoomElem)) {
            const mapElems = getMapObjects(
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

export const removeTimeFrameToggle = () => {
    const matchRoomElem = getMatchRoomRoot();
    if (matchRoomElem) {
        if (hasToggleElements(matchRoomElem)) {
            const toggleGroup = getToggleGroup(matchRoomElem);

            toggleGroup.remove();
        }
    }
};
