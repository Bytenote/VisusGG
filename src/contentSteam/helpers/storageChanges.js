import browser from 'webextension-polyfill';
import { isEqual } from '../../shared/helpers';
import { setSyncStorage } from '../../shared/storage';
import { removeStatsContainer } from '../components/stats';
import { addFaceItStats } from '../features/addFaceItStats';

export const initStorageChangeListener = () => {
	browser.storage.local.onChanged.removeListener(updateStorage);
	browser.storage.local.onChanged.addListener(updateStorage);
};

const UPDATE_FUNC = {
	usesSteam: (key, newValue) => steamUpdater(key, newValue),
};

const updateStorage = async (changes) => {
	const [[key, { oldValue, newValue }]] = Object.entries(changes);

	if (!isEqual(oldValue, newValue)) {
		UPDATE_FUNC[key]?.(key, newValue);
	}
};

const steamUpdater = (key, newValue) => {
	setSyncStorage(key, newValue);

	if (!newValue) {
		removeStatsContainer();
	}
	addFaceItStats();
};
