import { getSyncStorage } from '../../shared/storage';
import { createStatsContainer, hydrateStats } from '../components/stats';
import {
    getExtensionContainer,
    getSteamId,
    hasExtension,
} from '../helpers/profile';
import { getStats } from '../helpers/stats';

export const addFaceItStats = async () => {
    if (!getSyncStorage('usesSteam')) {
        return;
    }

    const extensionContainer = getExtensionContainer();
    if (extensionContainer) {
        if (!hasExtension()) {
            createStatsContainer(extensionContainer);
        }

        const steamId = getSteamId();
        const { stats, selectedGame } = await getStats(steamId);
        hydrateStats(stats, selectedGame);
    }
};
