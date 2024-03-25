import { addCreatorBadge } from './features/addCreatorBadge';
import { addMapStats } from './features/addMapStats';
import { addStylingElement } from './features/addStylingElement';
import { addTimeFrameToggle } from './features/addTimeFrameToggle';
import { getMatchInfo } from '../shared/helpers/api';
import { initStorage } from '../shared/storage';
import { getContentRoot, getRoomId } from './helpers/matchroom';
import { getBannerRoot, getCreatorProfile } from './helpers/profile';
import { isLoggedIn } from './helpers/user';
import { isPlayerOfMatch } from './helpers/teams';
import { initStorageChangeListener } from './helpers/storageChanges';
import { OBSERVER_OPTIONS } from '../shared/constants';

const domObserver = () => {
	const observer = new MutationObserver(async () => {
		const roomId = getRoomId();

		if (roomId) {
			const rootElem = getContentRoot();
			if (rootElem) {
				const matchInfo = (await getMatchInfo(roomId)) ?? {};
				if (matchInfo && isPlayerOfMatch(roomId, matchInfo.teams)) {
					addStylingElement(rootElem);
					addTimeFrameToggle(matchInfo);
					await addMapStats(matchInfo);
				}
			}
		} else if (getCreatorProfile()) {
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
