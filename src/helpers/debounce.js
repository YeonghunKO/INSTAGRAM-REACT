let timer;
export const debounce = (callback, delay) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(callback, delay);
};
