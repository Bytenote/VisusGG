export const displaySnackbar = (parent, message) => {
    removeSnackbar();

    const feedbackElem = document.createElement('div');
    feedbackElem.classList.add('feedback');
    feedbackElem.textContent = message;

    parent.append(feedbackElem);

    setTimeout(() => {
        feedbackElem.remove();
    }, 1500);
};

const removeSnackbar = () => {
    const feedbackElem = document.querySelector('.feedback');
    if (feedbackElem) {
        feedbackElem.remove();
    }
};
