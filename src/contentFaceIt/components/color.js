export const setColorOfElements = (color, elements) =>
	elements.forEach(({ element, type, opacity }) => {
		element.style.cssText = `${type}: rgb(${color}${
			opacity ? ', ' + opacity : ''
		})`;
	});
