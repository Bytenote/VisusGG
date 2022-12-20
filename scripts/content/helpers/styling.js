import { EXTENSION_NAME } from '../../shared/constants';

export const hasStylingElements = (parent) =>
	!!parent.getElementById(`${EXTENSION_NAME}-styling`);
