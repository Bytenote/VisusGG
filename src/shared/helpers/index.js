export const isEqual = (oldVal, newVal) => {
    if (oldVal === newVal) {
        return true;
    }

    if (oldVal) {
        if (typeof oldVal === 'object') {
            if (Array.isArray(oldVal)) {
                if (oldVal.length === newVal.length) {
                    let i = oldVal.length;

                    for (i; i--; ) {
                        if (!isEqual(oldVal[i], newVal[i])) {
                            return false;
                        }
                    }

                    return true;
                }

                return false;
            } else {
                const oldKeys = Object.keys(oldVal);
                const newKeys = Object.keys(newVal);

                if (oldKeys.length === newKeys.length) {
                    for (const key in oldVal) {
                        if (!isEqual(oldVal[key], newVal[key])) {
                            return false;
                        }
                    }

                    return true;
                }

                return false;
            }
        }

        return false;
    }

    return false;
};
