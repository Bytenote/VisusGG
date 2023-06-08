import browser from 'webextension-polyfill';
import {
	getStorage,
	getSyncStorage,
	setSyncStorage,
} from '../../shared/storage';
import { isEqual } from '../../shared/helpers';
import { addMapStats, removeMapStats } from '../features/addMapStats';
import {
	addTimeFrameToggle,
	removeTimeFrameToggle,
} from '../features/addTimeFrameToggle';
import { getMatchInfo } from '../../shared/helpers/api';
import { getMatchRoomRoot, getRoomId } from './matchroom';
import { isPlayerOfMatch } from './teams';

const UPDATE_FUNC = {
	toggles: (key, newValue) => DOMUpdater(key, newValue),
	usesCompareMode: (key, newValue) => genericUpdater(key, newValue),
	usesFaceIt: (key, newValue) => genericUpdater(key, newValue),
	colors: (key, newValue) => genericUpdater(key, newValue),
};

export const initStorageChangeListener = () => {
	browser.storage.local.onChanged.removeListener(updateStorage);
	browser.storage.local.onChanged.addListener(updateStorage);
};

const updateStorage = async (changes) => {
	const [[key, { oldValue, newValue }]] = Object.entries(changes);

	if (!isEqual(oldValue, newValue)) {
		UPDATE_FUNC[key]?.(key, newValue);
	}
};

const DOMUpdater = async (key, toggles) => {
	const roomId = getRoomId();

	if (roomId) {
		const rootElem = getMatchRoomRoot();
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

			removeTimeFrameToggle(rootElem);
			if (key === 'usesFaceIt' && !getSyncStorage(key)) {
				removeMapStats(rootElem);
			}

			addTimeFrameToggle(rootElem, matchInfo);
			await addMapStats(rootElem, matchInfo);
		}
	}
};

const genericUpdater = (key, newValue) => {
	const toggles = getSyncStorage('toggles');

	setSyncStorage(key, newValue);
	DOMUpdater(key, toggles);
};