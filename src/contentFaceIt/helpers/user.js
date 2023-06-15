export const getCurrentUserId = () => {
	const legacyId = JSON.parse(
		localStorage.getItem('C_UCURRENT_USER.data.CURRENT_USER')
	)?.value?.currentUser?.id;
	if (legacyId) {
		return legacyId;
	}

	for (const key in localStorage) {
		const isId1 = key.includes('ab.storage.userId.');
		const isId2 = key.includes('ab.storage.attributes.');
		const isId3 = key.includes('ab.storage.events.');
		let id = null;

		if (isId1) {
			id = JSON.parse(localStorage[key])?.v?.g;
		} else if (isId2) {
			id = Object.keys(JSON.parse(localStorage[key])?.v || {})?.[0];
		} else if (isId3) {
			id = JSON.parse(localStorage[key])?.v?.[0]?.u;
		}

		if (id) {
			return id;
		}
	}

	return null;
};

export const isLoggedIn = () => !!localStorage.getItem('token');
