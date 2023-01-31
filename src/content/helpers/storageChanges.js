import browser from 'webextension-polyfill';
import {
	getStorage,
	getSyncStorage,
	setSyncStorage,
} from '../../shared/storage';
import { isEqual } from '../../shared/helpers';
import { addMapStats } from '../features/addMapStats';
import {
	addTimeFrameToggle,
	removeTimeFrameToggle,
} from '../features/addTimeFrameToggle';
import { getMatchInfo } from './api';
import { getMatchRoomRoot, getRoomId } from './matchroom';
import { isPlayerOfMatch } from './teams';

export const initStorageChangeListener = () => {
	browser.storage.local.onChanged.removeListener(updateStorage);
	browser.storage.local.onChanged.addListener(updateStorage);
};

const updateStorage = async (changes) => {
	const [[key, { oldValue, newValue }]] = Object.entries(changes);

	if (!isEqual(oldValue, newValue)) {
		updateFunc[key]?.(key, newValue);
	}
};

const updateFunc = {
	toggles: (key, newValue) => DOMUpdater(key, newValue),
	usesCompareMode: (key, newValue) => genericUpdater(key, newValue),
	colors: (key, newValue) => genericUpdater(key, newValue),
};

const DOMUpdater = async (_, toggles) => {
	const roomId = getRoomId();

	if (roomId) {
		const shadowElem = getMatchRoomRoot();
		const matchInfo = (await getMatchInfo(roomId)) ?? {};

		if (matchInfo && isPlayerOfMatch(roomId, matchInfo.teams)) {
			const timeFrame = await getStorage('timeFrame');
			const foundToggle =
				(await toggles.find((toggle) => toggle.maxAge === timeFrame)) ||
				toggles[0];

			if (foundToggle) {
				setSyncStorage('timeFrame', foundToggle.maxAge);
			}
			setSyncStorage('toggles', toggles);

			removeTimeFrameToggle(shadowElem);
			addTimeFrameToggle(shadowElem, matchInfo);
			await addMapStats(shadowElem, matchInfo);
		}
	}
};

const genericUpdater = (key, newValue) => {
	const toggles = getSyncStorage('toggles');

	setSyncStorage(key, newValue);
	DOMUpdater(key, toggles);
};
