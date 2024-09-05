import { insertCreatorBadge } from '../components/badge';
import { getBannerPlayerCard, hasCreatorElement } from '../helpers/profile';

export const addCreatorBadge = (parent) => {
    const bannerElem = getBannerPlayerCard(parent);
    if (bannerElem && !hasCreatorElement(bannerElem)) {
        insertCreatorBadge(bannerElem);
    }
};
