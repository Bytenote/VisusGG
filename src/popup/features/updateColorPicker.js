import Coloris from '@melloware/coloris';
import { convertRGBToHexColor } from '../../shared/helpers/colorConverter';
import { getSyncStorage } from '../../shared/storage';
import { setColorPickerValue } from '../components/colorPicker';
import {
	getColorPickerElements,
	getColorType,
} from '../helpers/colorPickerHelpers';

export const setColorPickersColors = () => {
	const colors = getSyncStorage('colors');
	const colorPickerElems = getColorPickerElements();

	Coloris.init();
	Coloris({
		themeMode: 'dark',
		alpha: false,
	});

	for (const elem of colorPickerElems) {
		const color = colors[getColorType(elem)];
		const hexColor = convertRGBToHexColor(color);

		setColorPickerValue(elem, hexColor);
	}
};
