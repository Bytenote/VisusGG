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
import { resetForm } from '../helpers/inputHandlers';
import { getUpdatedColors } from './colorPickerHelpers';

const SUBMITTERS = {
	timeFrameSubmitter: (input, select) => timeFrameSubmitter(input, select),
	reset: () => resetSubmitter(),
};

export const submitHandler = async (e) => {
	e.preventDefault();

	const submitter = e.submitter?.name;
	const { input, select } = getFormData(e.target, submitter);

	if (input || submitter === 'reset') {
		if (SUBMITTERS?.[submitter]) {
			SUBMITTERS[submitter](input, select);

			displaySnackbar(e.target, 'Success');

			resetForm();
		}
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

const timeFrameSubmitter = async (input, select) => {
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
	setSyncStorage('colors', DEFAULT_COLORS);
};

const getFormData = (form, submitter) => {
	const formData = new FormData(form);
	const data = {
		input: null,
	};

	if (submitter === 'timeFrameSubmitter') {
		const input = formData.get('input');

		if (!isNaN(input) && input > 0) {
			data.input = formData.get('input');
			data['select'] = formData.get('select');
		}
	}

	return data;
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
