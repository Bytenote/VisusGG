import { CREATORS, EXTENSION_NAME } from '../../shared/constants';

export const getCreatorProfile = (path = location.pathname) => {
	const profile = /players(?:-modal)?\/([^/]+)/.exec(path);

	return CREATORS.includes(profile?.[1] || null) ? profile[1] : null;
};

export const getBannerRoot = () =>
	document.querySelector('.modal-content parasite-player-profile') ||
	document.querySelector('#parasite-container');

export const getBanner = (root) => {
	const hasAvatar = !!(
		root.querySelector('i[data-testid="avatar"]') ||
		root.querySelector('img[aria-label="avatar"]')
	);
	if (hasAvatar) {
		const playerName =
			root.querySelector('h5[size="5"]')?.parentElement?.parentElement;

		return playerName;
	}

	return null;
};

export const hasCreatorElement = (bannerElem) =>
	!!bannerElem.querySelector(`#${EXTENSION_NAME}-badge`);
