export const convertHexToRGBColor = (hexColor) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);

	if (result) {
		return `${parseInt(result[1], 16)}, ${parseInt(
			result[2],
			16
		)}, ${parseInt(result[3], 16)}`;
	}

	return null;
};

export const convertRGBToHexColor = (rgbColor) => {
	const rgbArr = rgbColor.split(', ');

	return rgbArr.reduce(
		(acc, curr) =>
			(acc += (+curr).toString(16).padStart(2, '0').toUpperCase()),
		'#'
	);
};
