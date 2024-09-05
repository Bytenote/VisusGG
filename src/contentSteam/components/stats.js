import { EXTENSION_NAME, VIP_STEAM_IDS } from '../../shared/constants';
import { getLevelImg } from '../helpers/profile';

export const createStatsContainer = (parent) => {
    const unrankedImg = chrome.runtime.getURL('imgs/f00.png');
    const statsContainer = document.createElement('div');
    const customizationContainer = document.createElement('div');
    const customizationBlock = document.createElement('div');
    const showcaseContainer = document.createElement('div');
    const showCaseBackground = document.createElement('div');
    const levelContainer = document.createElement('div');
    const contentContainer = document.createElement('div');
    const playerHeader = document.createElement('div');
    const playerBody = document.createElement('div');
    const playerNameElem = document.createElement('a');
    const levelElem = document.createElement('img');

    statsContainer.id = `${EXTENSION_NAME}-container`;
    showcaseContainer.id = `${EXTENSION_NAME}-showcase-container`;
    levelContainer.id = `${EXTENSION_NAME}-level-container`;
    levelElem.id = `${EXTENSION_NAME}-player-level`;
    playerNameElem.id = `${EXTENSION_NAME}-player-name`;
    contentContainer.id = `${EXTENSION_NAME}-content-container`;
    playerHeader.id = `${EXTENSION_NAME}-player-header`;
    playerBody.id = `${EXTENSION_NAME}-stats-player-body`;

    customizationContainer.classList.add('profile_customization');
    customizationBlock.classList.add('profile_customization_block');
    showcaseContainer.classList.add('favoritegroup_showcase_group');
    showCaseBackground.classList.add('showcase_content_bg');
    contentContainer.classList.add('favoritegroup_content');
    playerHeader.classList.add('favoritegroup_namerow', 'ellipsis');
    playerBody.classList.add('favoritegroup_stats', 'showcase_stats_row');
    playerNameElem.classList.add('favoritegroup_name', 'whitelink');

    customizationContainer.setAttribute('data-panel', '{"type":"PanelGroup"}');
    levelElem.src = unrankedImg;
    playerNameElem.href = '#';

    playerNameElem.textContent = '-';

    addStats(playerBody);

    const customizationHeader = createHeader();

    playerHeader.append(playerNameElem);
    contentContainer.append(playerHeader, playerBody);
    levelContainer.appendChild(levelElem);
    showcaseContainer.append(levelContainer, contentContainer);
    showCaseBackground.append(showcaseContainer);
    customizationBlock.appendChild(showCaseBackground);
    customizationContainer.append(customizationHeader, customizationBlock);
    statsContainer.appendChild(customizationContainer);

    parent.insertAdjacentElement('afterbegin', statsContainer);
};

export const hydrateStats = (stats, selectedGame) => {
    const nicknameElem = document.getElementById(
        `${EXTENSION_NAME}-player-name`
    );

    if (stats?.nickname) {
        addGameSelector(stats, selectedGame);

        const descriptionNode = document.createTextNode(
            ` - ${stats.description}`
        );
        const playerHeader = document.getElementById(
            `${EXTENSION_NAME}-player-header`
        );
        let flagElem = document.getElementById(`${EXTENSION_NAME}-stats-flag`);
        if (!flagElem) {
            flagElem = document.createElement('img');
            flagElem.id = `${EXTENSION_NAME}-stats-flag`;
        }

        flagElem.id = `${EXTENSION_NAME}-stats-flag`;

        flagElem.src = `https://cdn-frontend.faceit.com/web/112-1536332382/src/app/assets/images-compress/flags/${stats.country}.png`;
        flagElem.title = stats.country?.toLowerCase();
        flagElem.alt = stats.country?.toLowerCase();

        nicknameElem.href = `https://www.faceit.com/en/players/${stats.nickname}`;
        nicknameElem.target = '_blank';

        if (stats.banReason) {
            addBanBanner(stats);
        }

        if (stats.steamId in VIP_STEAM_IDS) {
            const vip = VIP_STEAM_IDS[stats.steamId];
            addVIPBanner(vip);
        }

        playerHeader.prepend(flagElem);
        playerHeader.appendChild(descriptionNode);

        nicknameElem.textContent = stats.nickname;

        updateStats(stats, selectedGame);
    } else {
        nicknameElem.textContent = 'No account found';
        nicknameElem.style.cursor = 'default';
    }
};

export const removeStatsContainer = () => {
    const statsContainer = document.querySelector(
        `#${EXTENSION_NAME}-container`
    );
    if (statsContainer) {
        statsContainer.remove();
    }
};

const updateStats = (stats, selectedGame) => {
    if (stats?.nickname) {
        const levelElem = document.getElementById(
            `${EXTENSION_NAME}-player-level`
        );
        const eloElem = document.getElementById(`${EXTENSION_NAME}-stats-elo`);
        const matchesElem = document.getElementById(
            `${EXTENSION_NAME}-stats-matches`
        );
        const avgKillsElem = document.getElementById(
            `${EXTENSION_NAME}-stats-avg-kills`
        );
        const avgKdElem = document.getElementById(
            `${EXTENSION_NAME}-stats-avg-kd`
        );
        const avgKrElem = document.getElementById(
            `${EXTENSION_NAME}-stats-avg-kr`
        );

        levelElem.src = chrome.runtime.getURL(
            `imgs/f${getLevelImg(stats?.[selectedGame].level)}.png`
        );
        eloElem.textContent = stats[selectedGame]?.elo ?? '-';
        matchesElem.textContent = stats[selectedGame]?.matches ?? '-';
        avgKillsElem.textContent = stats[selectedGame]?.avgKills ?? '-';
        avgKdElem.textContent = stats[selectedGame]?.avgKillsPerDeath ?? '-';
        avgKrElem.textContent = stats[selectedGame]?.avgKillsPerRound ?? '-';
    }
};

const createHeader = () => {
    const customizationHeader = document.createElement('div');
    const customizationHeaderTitle = document.createElement('span');

    customizationHeader.id = `${EXTENSION_NAME}-customization-header`;
    customizationHeader.classList.add('profile_customization_header');

    customizationHeader.style.display = 'flex';
    customizationHeader.style.justifyContent = 'space-between';
    customizationHeaderTitle.textContent = 'FACEIT';

    customizationHeader.append(customizationHeaderTitle);

    return customizationHeader;
};

const createGameSelector = () => {
    const showcaseBgElem = document.querySelector(
        `#${EXTENSION_NAME}-container .showcase_content_bg`
    );
    const gameSelectorContainer = document.createElement('div');
    const gameSelector = document.createElement('select');

    gameSelector.id = `${EXTENSION_NAME}-game-selector`;

    gameSelector.style.minWidth = '120px';
    gameSelector.style.maxWidth = '180px';
    gameSelector.style.background =
        getComputedStyle(showcaseBgElem)?.backgroundColor;
    gameSelectorContainer.classList.add('responsive_tab_control');

    const options = ['CS2', 'CSGO'];
    for (const option of options) {
        const optionElem = document.createElement('option');
        optionElem.value = option.toLowerCase();
        optionElem.textContent = option;

        gameSelector.appendChild(optionElem);
    }

    gameSelector.value = '';

    gameSelectorContainer.appendChild(gameSelector);

    return gameSelectorContainer;
};

const addGameSelector = (stats, selectedGame) => {
    const gameSelectorContainer = createGameSelector();
    const showcaseHeader = document.getElementById(
        `${EXTENSION_NAME}-customization-header`
    );

    showcaseHeader.appendChild(gameSelectorContainer);

    const gameSelector = document.getElementById(
        `${EXTENSION_NAME}-game-selector`
    );
    gameSelector.value = selectedGame;

    const onGameSelectorChange = (e) => {
        const newVal = e.target.value;

        updateStats(stats, newVal);
    };
    gameSelector.removeEventListener('change', onGameSelectorChange);
    gameSelector.addEventListener('change', onGameSelectorChange);
};

const addStats = (statsContainer) => {
    const statsGroupOne = document.createElement('div');
    const statsGroupTwo = document.createElement('div');

    statsGroupOne.classList.add(`${EXTENSION_NAME}-stats-group-one`);
    statsGroupTwo.classList.add(`${EXTENSION_NAME}-stats-group-two`);

    const statsClasses = [
        {
            classes: [
                'showcase_stat',
                'favoritegroup_online',
                `${EXTENSION_NAME}-stats-wrapper`,
            ],
            label: 'Elo',
            id: `${EXTENSION_NAME}-stats-elo`,
        },
        {
            classes: [
                'showcase_stat',
                'favoritegroup_online',
                `${EXTENSION_NAME}-stats-wrapper`,
            ],
            label: 'Matches',
            id: `${EXTENSION_NAME}-stats-matches`,
        },
        {
            classes: [
                'showcase_stat',
                'favoritegroup_inchat',
                `${EXTENSION_NAME}-stats-wrapper`,
            ],
            label: 'AVG Kills',
            id: `${EXTENSION_NAME}-stats-avg-kills`,
        },
        {
            classes: [
                'showcase_stat',
                'favoritegroup_inchat',
                `${EXTENSION_NAME}-stats-wrapper`,
            ],
            label: 'AVG K/D',
            id: `${EXTENSION_NAME}-stats-avg-kd`,
        },
        {
            classes: [
                'showcase_stat',
                'favoritegroup_inchat',
                `${EXTENSION_NAME}-stats-wrapper`,
            ],
            label: 'AVG K/R',
            id: `${EXTENSION_NAME}-stats-avg-kr`,
        },
    ];

    for (const { classes, label, id } of statsClasses) {
        const statContainer = document.createElement('div');
        const statContainer2 = document.createElement('div');
        const valueContainer = document.createElement('div');
        const labelContainer = document.createElement('div');

        statContainer.classList.add(...classes);
        valueContainer.classList.add('value');
        labelContainer.classList.add('label');

        valueContainer.id = id;

        statContainer2.style.display = 'inline-block';

        valueContainer.textContent = '-';
        labelContainer.textContent = label;

        if (label === 'Elo' || label === 'Matches') {
            statContainer2.append(valueContainer, labelContainer);

            statContainer.append(statContainer2);
            statsGroupOne.appendChild(statContainer);
        } else {
            statContainer.append(valueContainer, labelContainer);
            statsGroupTwo.appendChild(statContainer);
        }

        statsContainer.append(statsGroupOne, statsGroupTwo);
    }
};

const addBanBanner = ({ membership, banReason }) => {
    let label = `Temp banned for ${banReason}`;
    let bannerId = `${EXTENSION_NAME}-temp-ban-banner`;

    if (membership === 'Banned') {
        label = `Banned for ${banReason}`;
        bannerId = `${EXTENSION_NAME}-ban-banner`;
    }

    addBanner(label, bannerId);
};

const addVIPBanner = ({ label, color }) => {
    const bannerId = `${EXTENSION_NAME}-vip-banner`;

    addBanner(label, bannerId, color);
};

const addBanner = (label, id, color) => {
    const playerHeader = document.getElementById(
        `${EXTENSION_NAME}-player-header`
    );
    const bannerContainer = document.createElement('div');

    bannerContainer.classList.add(
        'favoritegroup_description',
        `${EXTENSION_NAME}-banner`
    );

    bannerContainer.id = id;
    bannerContainer.textContent = label;

    if (color) {
        bannerContainer.style.background = color;
    }

    playerHeader.insertAdjacentElement('afterend', bannerContainer);
};
