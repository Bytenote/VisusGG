import { EXTENSION_NAME } from '../../shared/constants';
import { getCurrentUserId } from './user';

export const getRoomId = (path = location.pathname) =>
	/room\/([0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+(?:-[0-9a-z]+)?)/.exec(
		path
	)?.[1] || null;

export const isPlayerOfMatch = (teams) =>
	teams?.faction1?.roster?.find(
		(player) => player.id === getCurrentUserId()
	) ||
	teams?.faction2?.roster?.find((player) => player.id === getCurrentUserId());

export const getMatchroomRoot = () =>
	document.getElementById('parasite-container')?.shadowRoot;

export const getMapElementsParent = (matchRoomElem) => {
	const miscElem = matchRoomElem.querySelector(
		"div > div[name='info'] > div > div"
	);
	const miscElem2 =
		miscElem?.children?.[2]?.nodeName?.toLowerCase() === 'div'
			? miscElem.children[2]
			: miscElem?.querySelector('div');
	const parent =
		miscElem2?.children?.length > 1
			? miscElem2
			: miscElem2?.querySelector('div');

	return parent;
};

export const getMapElements = (matchRoomElem) => {
	const mapElementsParent = getMapElementsParent(matchRoomElem);

	if (mapElementsParent) {
		const filteredParents = [...mapElementsParent.children].filter(
			(elem) => !elem.getAttribute('id', `${EXTENSION_NAME}-button-group`)
		);
		const mapName = getMapName(filteredParents?.[3]);

		if (filteredParents && filteredParents.length > 0 && mapName) {
			if (getMapName(filteredParents?.[0])) {
				return filteredParents;
			}

			return [mapElementsParent.lastChild];
		}
	}
};

export const getOpponents = (teams) =>
	teams.faction1?.roster?.find((player) => player?.id === getCurrentUserId())
		? teams?.faction2?.roster
		: teams?.faction1?.roster;

export const getMapName = (mapElement) =>
	mapElement?.children[1]?.children?.[1]?.firstChild?.textContent ||
	mapElement?.children[0]?.children?.[1]?.firstChild?.textContent;

export const hasStatsElements = (parent) =>
	[...parent.querySelectorAll(`div.${EXTENSION_NAME}-stats`)].length > 0;

export const hasToggleElements = (parent) =>
	!!parent.querySelector(`#${EXTENSION_NAME}-button-group`);

export const getToggleGroup = (parent) =>
	parent.querySelector(`#${EXTENSION_NAME}-button-group`);
