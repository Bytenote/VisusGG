import { EXTENSION_NAME } from '../../shared/constants';

export const getOptimizedElement = (attr, cb) => {
    const idAttr = `${EXTENSION_NAME}-${attr}`;
    const optimizedRoot =
        document.getElementById(idAttr) ??
        getExtensionDataAttributeElement(attr);
    if (!optimizedRoot) {
        const rootElemOnce = cb();
        if (rootElemOnce) {
            if (rootElemOnce.hasAttribute('id')) {
                rootElemOnce.setAttribute(`data-${EXTENSION_NAME}`, attr);
            } else {
                rootElemOnce.setAttribute('id', idAttr);
            }

            return rootElemOnce;
        }
    }

    return optimizedRoot;
};

export const findElementRecursively = (args, cb) => {
    const [parent, ...r] = args;
    if (cb(...args)) {
        return parent;
    }

    for (const child of parent.children) {
        const foundElem = findElementRecursively([child, ...r], cb);
        if (foundElem) {
            return foundElem;
        }
    }
};

export const getSameParentElement = (elem1, elem2) => {
    const parents1 = getParentElements(elem1);
    const parents2 = getParentElements(elem2);

    for (const parent1 of parents1) {
        for (const parent2 of parents2) {
            if (parent1 === parent2) {
                return parent1;
            }
        }
    }

    return null;
};

export const getDirectChildTextContent = (elem) =>
    [].reduce.call(
        elem.childNodes,
        (a, b) => a + (b.nodeType === 3 ? b.textContent.trim() : ''),
        ''
    );

const getExtensionDataAttributeElement = (attr) =>
    document.querySelector(`[data-${EXTENSION_NAME}="${attr}"]`);

const getParentElements = (elem) => {
    const parents = [];
    let parent = elem;

    while (parent) {
        parents.push(parent);
        parent = parent.parentElement;
    }

    return parents;
};
