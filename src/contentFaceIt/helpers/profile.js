import { CREATORS, EXTENSION_NAME } from '../../shared/constants';

export const getCreatorProfile = (path = location.pathname) => {
	const profile = /players(?:-modal)?\/([^/]+)/.exec(path);

	return CREATORS.includes(profile?.[1] || null) ? profile[1] : null;
};

export const getBannerRoot = () =>
	document.querySelector('.modal-content parasite-player-profile') ??
	document.getElementById('parasite-container') ??
	getBetaBannerRoot();

export const getBanner = (parent) => {
	const hasAvatar = !!getAvatar(parent);
	if (hasAvatar) {
		const playerName =
			parent.querySelector('h5[size="5"]')?.parentElement?.parentElement;

		return playerName;
	}

	return null;
};

export const hasCreatorElement = (bannerElem) =>
	!!bannerElem.querySelector(`#${EXTENSION_NAME}-badge`);

const getBetaBannerRoot = () => {
	return (
		(document.querySelector('.FuseModalPortal') &&
			document.querySelector('i[title="close-icon"]')?.parentElement) ??
		document.getElementById('main-layout-content')
	);
};

const getAvatar = (parent) => {
	return (
		parent?.querySelector('i[data-testid="avatar"]') ||
		parent?.querySelector('img[aria-label="avatar"]')
	);
};
