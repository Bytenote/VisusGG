import { convertHexToRGBColor } from '../../shared/helpers/colorConverter';
import { getSyncStorage } from '../../shared/storage';
import { setColorPickerValue } from '../components/colorPicker';

export const getColorType = (elem) =>
	elem.id.endsWith('1') ? 'cVal1' : 'cVal2';

export const getUpdatedColors = (elem, newColor) => {
	const colors = JSON.parse(JSON.stringify(getSyncStorage('colors')));
	const colorType = getColorType(elem);
	const rgbColor = convertHexToRGBColor(newColor);

	colors[colorType] = rgbColor;

	return colors;
};

export const getColorPickerElements = () => [
	document.getElementById('form-picker1'),
	document.getElementById('form-picker2'),
];

export const colorPickerInputHandler = (e) =>
	setColorPickerValue(e.target, e.target.value);
