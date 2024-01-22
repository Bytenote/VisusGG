import { EXTENSION_NAME } from '../../shared/constants';
import { getMapDictMemoized } from './stats';

export const getRoomId = (path = location.pathname) =>
	/room\/([0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+(?:-[0-9a-z]+)?)/.exec(
		path
	)?.[1] || null;

export const getMatchRoomRoot = () =>
	document.querySelector('#parasite-container');

export const getMapElements = (
	matchRoomElem,
	matchRoomId,
	matchRoomMaps = []
) => {
	const mapDict = getMapDictMemoized(matchRoomId, matchRoomMaps);
	const matchRoomInfoColumn = matchRoomElem.querySelector(
		"div > div[name='info']"
	);

	const matchRoomContainer = matchRoomInfoColumn ?? matchRoomElem;
	if (!!matchRoomContainer) {
		const endSlotElems =
			matchRoomContainer?.querySelectorAll('div.endSlot');
		const mapElements = [...endSlotElems].reduce((acc, curr) => {
			if (
				curr?.parentElement.querySelector('div.startSlot') &&
				curr.parentElement.querySelector('div.middleSlot')
			) {
				const mapName = getMapNameFromElement(
					curr.parentElement.querySelector('div.middleSlot'),
					mapDict
				);
				if (mapName) {
					acc.push({
						mapElem: curr.parentElement?.parentElement,
						mapName,
					});
				}

				return acc;
			}
		}, []);

		if (mapElements.length === 0) {
			for (const map of matchRoomMaps) {
				const mapElem =
					matchRoomElem.querySelector(`div[src="${map.image_sm}"]`)
						?.parentElement?.parentElement?.parentElement ??
					matchRoomElem.querySelector(`div[src="${map.image_lg}"]`)
						?.parentElement?.parentElement?.parentElement;

				if (mapElem) {
					const mapName = checkParentForMapName(mapElem, mapDict);

					mapElements.push({
						mapElem,
						mapName,
					});
				}
			}
		}

		return mapElements;
	}
};

export const hasStatsElements = (parent) =>
	[...parent.querySelectorAll(`div.${EXTENSION_NAME}-stats`)].length > 0;

export const hasToggleElements = (parent) =>
	!!parent.querySelector(`#${EXTENSION_NAME}-button-group`);

export const getToggleGroup = (parent) =>
	parent.querySelector(`#${EXTENSION_NAME}-button-group`);

const getMapNameFromElement = (element, mapDict) => {
	const mapNames = mapDict[element.textContent.trim()];
	if (mapNames) {
		return (
			mapNames.class_name ||
			mapNames.name ||
			mapNames.guid ||
			mapNames.game_map_id
		);
	}
};

const checkParentForMapName = (parent, mapDict) => {
	const mapName = getMapNameFromElement(parent, mapDict);
	if (mapName) {
		return mapName;
	}

	for (const child of parent.children) {
		const mapName = checkParentForMapName(child, mapDict);
		if (mapName) {
			return mapName;
		}
	}
};
