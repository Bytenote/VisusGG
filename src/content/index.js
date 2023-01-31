import { addCreatorBadge } from './features/addCreatorBadge';
import { addMapStats } from './features/addMapStats';
import { addStylingElement } from './features/addStylingElement';
import { addTimeFrameToggle } from './features/addTimeFrameToggle';
import { getMatchInfo } from './helpers/api';
import { initStorage } from '../shared/storage';
import { getMatchRoomRoot, getRoomId } from './helpers/matchroom';
import { getBannerRoot, getCreatorProfile } from './helpers/profile';
import { isLoggedIn } from './helpers/user';
import { isPlayerOfMatch } from './helpers/teams';
import { initStorageChangeListener } from './helpers/storageChanges';

const domObserver = () => {
	const observer = new MutationObserver(async (mutationList) => {
		const roomId = getRoomId();

		if (roomId) {
			const shadowElem = getMatchRoomRoot();
			if (shadowElem) {
				const matchInfo = (await getMatchInfo(roomId)) ?? {};
				if (matchInfo && isPlayerOfMatch(roomId, matchInfo.teams)) {
					addStylingElement(shadowElem);
					addTimeFrameToggle(shadowElem, matchInfo);
					await addMapStats(shadowElem, matchInfo);
				}
			}
		} else if (getCreatorProfile()) {
			const shadowElem = getBannerRoot();
			if (shadowElem) {
				addStylingElement(shadowElem);
				addCreatorBadge(shadowElem);
			}
		}

		for (const mutation of mutationList) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.shadowRoot) {
					observer.observe(addedNode.shadowRoot, {
						childList: true,
						subtree: true,
					});
				}
			}
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });
};

(async () => {
	if (isLoggedIn()) {
		await initStorage();
		initStorageChangeListener();

		domObserver();
	}
})();
