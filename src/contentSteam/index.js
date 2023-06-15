const { initStorage, getSyncStorage } = require('../shared/storage');
const { addFaceItStats } = require('./features/addFaceItStats');
const { initStorageChangeListener } = require('./helpers/storageChanges');

(async () => {
	await initStorage();
	initStorageChangeListener();

	if (getSyncStorage('usesSteam')) {
		addFaceItStats();
	}
})();
