import { EXTENSION_NAME } from '../../shared/constants';

export const getSteamId = () =>
    getSteamIdFromAbuseForm() ??
    getSteamIdFromPageTemplateScript() ??
    getSteamIdFromReportButton();

export const getExtensionContainer = () => {
    const innerElem = document.querySelector('.profile_content_inner');
    const leftColElem = innerElem?.querySelector('.profile_leftcol');

    return leftColElem ?? null;
};

export const hasExtension = () =>
    !!document.getElementById(`${EXTENSION_NAME}-container`);

export const getLevelImg = (level) => {
    if (typeof level === 'number') {
        if (level < 10) {
            return `0${level}`;
        }

        return level;
    }

    return '00';
};

const getSteamIdFromAbuseForm = () => {
    const abuseForm = document.getElementById('abuseForm');
    const steamId = abuseForm?.querySelector('input[name="abuseID"]')?.value;

    return steamId ?? null;
};

const getSteamIdFromPageTemplateScript = () => {
    const pageTemplate = document.getElementById(
        'responsive_page_template_content'
    );
    const pageTemplateScript = pageTemplate?.querySelector(
        'script[type="text/javascript"]'
    );
    const steamId =
        pageTemplateScript?.textContent?.match(/"steamid":"(\d+)"/)[1];

    return steamId ?? null;
};

const getSteamIdFromReportButton = () => {
    const popUpMenuParent = document.getElementById('profile_action_dropdown');
    const popUpMenu = popUpMenuParent?.querySelector(
        '.popup_body.popup_menu.shadow_content'
    );
    const menuItems = [
        ...(popUpMenu?.querySelectorAll('.popup_menu_item') ?? []),
    ];
    const reportButton = menuItems?.find(
        (elem) => elem.textContent.trim() === 'Report Player'
    );
    let steamId = null;

    if (reportButton) {
        steamId = reportButton.getAttribute('onclick').match(/'([^']+)'/)[1];
    }

    return steamId;
};
