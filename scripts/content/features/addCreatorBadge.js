import { insertCreatorBadge } from '../components/badge';
import { getBanner, hasCreatorElement } from '../helpers/profile';

export const addCreatorBadge = (parent) => {
	const bannerElem = getBanner(parent);

	if (bannerElem && !hasCreatorElement(bannerElem)) {
		insertCreatorBadge(bannerElem);
	}
};
