import { EXTENSION_NAME } from '../../shared/constants';
import { getMapDictMemoized } from './stats';

export const getRoomId = (path = location.pathname) =>
	/room\/([0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+(?:-[0-9a-z]+)?)/.exec(
		path
	)?.[1] || null;

export const getMatchRoomRoot = () =>
	document.querySelector('#parasite-container');

export const getMapElements = (matchRoomElem, matchRoomId, matchRoomMaps) => {
	const mapElementsParent = getMapElementsParent(matchRoomElem);

	if (mapElementsParent) {
		const mapElements = [...mapElementsParent.children].reduce(
			(acc, curr) => {
				if (
					!curr.getAttribute('id', `${EXTENSION_NAME}-button-group`)
				) {
					const mapName = getMapNameFromElement(
						curr,
						matchRoomId,
						matchRoomMaps
					);
					if (mapName) {
						acc.push({
							mapElem: curr,
							mapName,
						});
					}
				}

				return acc;
			},
			[]
		);

		return mapElements;
	}
};

export const hasStatsElements = (parent) =>
	[...parent.querySelectorAll(`div.${EXTENSION_NAME}-stats`)].length > 0;

export const hasToggleElements = (parent) =>
	!!parent.querySelector(`#${EXTENSION_NAME}-button-group`);

export const getToggleGroup = (parent) =>
	parent.querySelector(`#${EXTENSION_NAME}-button-group`);

const getMapElementsParent = (matchRoomElem) => {
	const miscElem = matchRoomElem.querySelector(
		"div > div[name='info'] > div > div > div"
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

const getMapNameFromElement = (element, matchRoomId, matchRoomMaps) => {
	const elemChildren = element?.children;
	if (elemChildren) {
		const mapDict = getMapDictMemoized(matchRoomId, matchRoomMaps);

		for (const elem of elemChildren) {
			if (!elem.classList.contains(`${EXTENSION_NAME}-stats`)) {
				const elementName =
					elem?.children?.[1]?.firstChild?.textContent;
				const mapName = mapDict[elementName];

				if (mapName) {
					return (
						mapName.class_name ||
						mapName.name ||
						mapName.guid ||
						mapName.game_map_id
					);
				}
			}
		}
	}
};
