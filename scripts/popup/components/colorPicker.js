export const setColorPickerValue = (parent, color) => {
	parent.parentElement.style.background = color;
	parent.value = color;
};
