import { getSyncStorage } from '../../shared/storage';
import { timeFrameSubmitter } from './submitters';

export const getToggleInfo = (value) => {
	const toggles = getSyncStorage('toggles') ?? [];

	return (
		toggles.find(
			(toggle) => toggle.label === value || toggle.type === value
		) ?? {}
	);
};

export const onTimeFrameUnitClick = (e) => {
	const newUnitVal = e.target.value;
	const activeToggleBtn = document.querySelector(
		'#button-edit-group > .toggle-btn-active'
	);

	const toggle = getToggleInfo(activeToggleBtn.value);
	if (toggle.amount) {
		timeFrameSubmitter(
			toggle.amount,
			newUnitVal,
			activeToggleBtn.textContent
		);
	}
};

export const onTimeFrameNumberClick = (e) => {
	const newAmountVal = +e.target.value;
	const activeToggleBtn = document.querySelector(
		'#button-edit-group > .toggle-btn-active'
	);

	const toggle = getToggleInfo(activeToggleBtn.value);
	if (toggle.type) {
		timeFrameSubmitter(
			newAmountVal,
			toggle.type,
			activeToggleBtn.textContent
		);
	}
};
