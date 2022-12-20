import { CREATORS, EXTENSION_NAME } from '../../shared/constants';

export const getCreatorProfile = (path = location.pathname) => {
	const profile = /players(?:-modal)?\/([^/]+)/.exec(path);

	return CREATORS.includes(profile?.[1] || null) ? profile[1] : null;
};

export const getBannerRoot = () =>
	document.querySelector('parasite-player-banner')?.shadowRoot;

export const getBanner = (root) =>
	root.querySelector('h5[size="5"]')?.parentElement?.parentElement;

export const hasCreatorElement = (bannerElem) =>
	!!bannerElem.querySelector(`#${EXTENSION_NAME}-badge`);
