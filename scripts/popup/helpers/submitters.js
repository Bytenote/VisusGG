import {
	DEFAULT_COLORS,
	DEFAULT_COMPARE_MODE,
	DEFAULT_TOGGLES,
	EXTENSION_NAME,
} from '../../shared/constants';
import {
	getSyncStorage,
	setStorage,
	setSyncStorage,
} from '../../shared/storage';
import { displaySnackbar } from '../components/snackbar';
import { resetForm } from '../components/form';
import { getUpdatedColors } from './colorPickerHelpers';

export const submitHandler = async (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const input = +formData.get('input');
	const select = formData.get('select');
	const submitter = e.submitter.name;

	if (submitters?.[submitter]) {
		submitters[submitter](input, select);

		displaySnackbar(e.target, 'Success');

		resetForm();
	}
};

export const switchSubmitter = async (e) => {
	const formElem = document.querySelector(`#${EXTENSION_NAME}-form`);

	await setStorage('usesCompareMode', e.target.checked);

	displaySnackbar(formElem, 'Success');
};

export const colorPickerSubmitter = async (e) => {
	const formElem = document.querySelector(`#${EXTENSION_NAME}-form`);
	const updatedColors = getUpdatedColors(e.target, e.target.value);

	await setStorage('colors', updatedColors);
	setSyncStorage('colors', updatedColors);

	displaySnackbar(formElem, 'Success');
};

const submitters = {
	edit: (input, select) => editSubmitter(input, select),
	reset: () => resetSubmitter(),
};

const editSubmitter = async (input, select) => {
	const toggles = getSyncStorage('toggles');
	const activeLabel = document.querySelector(
		`.${EXTENSION_NAME}-toggle-active`
	)?.textContent;

	const toggleIndex = toggles.findIndex(
		(toggle) => toggle.label === activeLabel
	);
	if (toggleIndex >= 0) {
		const newToggle = {
			label: `${input}${select[0]}`,
			name: `${input} ${
				input > 1 ? select : select.slice(0, select.length - 1)
			}`,
			amount: input,
			type: select,
			maxAge: getAge(input, select),
		};

		toggles[toggleIndex] = newToggle;
	}

	await setStorage(
		'toggles',
		toggles.sort((a, b) => a?.maxAge - b?.maxAge)
	);
};

const resetSubmitter = async () => {
	await setStorage(
		'toggles',
		DEFAULT_TOGGLES.sort((a, b) => a?.maxAge - b?.maxAge)
	);
	await setStorage('usesCompareMode', DEFAULT_COMPARE_MODE);
	await setStorage('colors', DEFAULT_COLORS);
};

const getAge = (input, type) => {
	const defaultTime = 1000 * 60 * 60 * 24;
	const types = {
		days: defaultTime * input,
		weeks: defaultTime * input * 7,
		months: defaultTime * input * 30,
		years: defaultTime * input * 365,
	};

	return types[type];
};
