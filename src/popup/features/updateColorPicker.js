import Coloris from '@melloware/coloris';
import { convertRGBToHexColor } from '../../shared/colorConverter';
import { getSyncStorage } from '../../shared/storage';
import { setColorPickerValue } from '../components/colorPicker';
import {
	colorPickerInputHandler,
	getColorPickerElements,
	getColorType,
} from '../helpers/colorPickerHelpers';
import { colorPickerSubmitter } from '../helpers/submitters';

export const setColorPickersColors = () => {
	const colors = getSyncStorage('colors');
	const colorPickerElems = getColorPickerElements();

	Coloris.init();
	Coloris({
		// parent: '#FACE-M-form',
		themeMode: 'dark',
		alpha: false,
	});

	for (const elem of colorPickerElems) {
		const color = colors[getColorType(elem)];
		const hexColor = convertRGBToHexColor(color);

		elem.addEventListener('input', colorPickerInputHandler);
		elem.addEventListener('change', colorPickerSubmitter);

		setColorPickerValue(elem, hexColor);
	}
};
