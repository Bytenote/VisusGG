import { OBSERVER_OPTIONS } from '../shared/constants';
import { getMatchInfo } from '../shared/helpers/api';
import { getSyncStorage, initStorage } from '../shared/storage';
import { addCreatorBadge } from './features/addCreatorBadge';
import { addMapStats } from './features/addMapStats';
import { addStylingElement } from './features/addStylingElement';
import { addTimeFrameToggle } from './features/addTimeFrameToggle';
import {
    getContentRoot,
    getDialogSiblingRoot,
    getRoomId,
} from './helpers/matchroom';
import { getBannerRoot, isCreatorProfile } from './helpers/profile';
import { initStorageChangeListener } from './helpers/storageChanges';
import { isPlayerOfMatch } from './helpers/teams';
import { isLoggedIn } from './helpers/user';

const domObserver = () => {
    const observer = new MutationObserver(async () => {
        const roomId = getRoomId();

        if (roomId) {
            const rootElem = getContentRoot();
            if (rootElem) {
                const siblingRoot = getDialogSiblingRoot(rootElem);
                const matchInfo = (await getMatchInfo(roomId)) ?? {};
                if (matchInfo && isPlayerOfMatch(roomId, matchInfo.teams)) {
                    addStylingElement(rootElem);
                    addTimeFrameToggle(matchInfo, siblingRoot);
                    await addMapStats(matchInfo, siblingRoot);
                }
            }
        } else if (isCreatorProfile()) {
            const rootElem = getBannerRoot();
            if (rootElem) {
                addStylingElement(rootElem);
                addCreatorBadge(rootElem);
            }
        }
    });
    observer.observe(document.body, OBSERVER_OPTIONS);
};

(async () => {
    if (isLoggedIn()) {
        await initStorage();
        initStorageChangeListener();

        domObserver();
    }
})();
