import { getSyncStorage } from '../../shared/storage';

export const getColorToUse = (condition, ownTeamSide = false) => {
    const { cVal1, cVal2 } = getSyncStorage('colors');

    if (condition) {
        return ownTeamSide ? cVal2 : cVal1;
    } else {
        return ownTeamSide ? cVal1 : cVal2;
    }
};
