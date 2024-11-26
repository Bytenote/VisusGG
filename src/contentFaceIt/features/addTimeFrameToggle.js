import { EXTENSION_NAME } from '../../shared/constants';
import { getSyncStorage } from '../../shared/storage';
import { insertTimeFrameToggle } from '../components/toggle';
import {
    getMapObjects,
    getMatchRoomRoot,
    getToggleGroup,
    hasToggleElements,
} from '../helpers/matchroom';

export const addTimeFrameToggle = (matchInfo, siblingRoot) => {
    if (!getSyncStorage('usesFaceIt')) {
        return;
    }

    const idSuffix = siblingRoot ? '-1' : '-0';
    const matchRoomElem = getMatchRoomRoot(idSuffix, siblingRoot);
    const matchRoomMaps = matchInfo.matchCustom?.tree?.map?.values?.value;
    if (matchRoomElem && matchRoomMaps?.length > 0) {
        if (!hasToggleElements(idSuffix, matchRoomElem)) {
            const mapElems = getMapObjects(
                idSuffix,
                matchRoomElem,
                matchInfo.id,
                matchRoomMaps
            );
            if (mapElems && mapElems.length > 0) {
                const firstMapElem = mapElems[0].mapElem;
                insertTimeFrameToggle(idSuffix, firstMapElem);
            }
        }
    }

    return;
};

export const removeTimeFrameToggle = (idSuffix) => {
    const matchRoomElem = getMatchRoomRoot(idSuffix);
    if (matchRoomElem) {
        if (hasToggleElements(idSuffix, matchRoomElem)) {
            const toggleGroup = getToggleGroup(idSuffix, matchRoomElem);

            toggleGroup.remove();
        }
    }
};
