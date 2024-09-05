import { EXTENSION_NAME } from '../../shared/constants';

export const hasStylingElements = (parent) =>
    !!parent.querySelector(`#${EXTENSION_NAME}-styling`);
