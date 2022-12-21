import { DEFAULT_TOGGLES, EXTENSION_NAME } from '../../shared/constants';
import { getSyncStorage, setStorage } from '../../shared/storage';
import { displaySnackbar } from '../components/snackbar';
import { resetForm } from '../components/form';

export const submitHandler = async (e) => {
	e.preventDefault();

	const formData = new FormData(e.target);
	const input = +formData.get('input');
	const select = formData.get('select');
	const submitter = e.submitter.name;

	submitters[submitter](input, select);

	displaySnackbar(e.target, 'Success');

	resetForm();
};

const submitters = {
	edit: (input, select) => editHandler(input, select),
	reset: () => resetHandler(),
};

const editHandler = async (input, select) => {
	let toggles = getSyncStorage('toggles');
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

const resetHandler = async () => {
	await setStorage(
		'toggles',
		DEFAULT_TOGGLES.sort((a, b) => a?.maxAge - b?.maxAge)
	);
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
