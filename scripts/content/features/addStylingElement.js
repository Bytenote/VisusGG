import { createStylingElement } from '../components/style';
import { hasStylingElements } from '../helpers/styling';

export const addStylingElement = async (parent) => {
	if (!hasStylingElements(parent)) {
		createStylingElement(parent);
	}

	return;
};
