import PropTypes from 'prop-types';

const setItem = (keyword, value) => {
  localStorage.setItem(keyword, JSON.stringify(value));
};

const getItem = (keyword, defaultValue = '') => {
  const storedData = localStorage.getItem(keyword);
  if (!storedData) {
    return defaultValue;
  }
  return JSON.parse(storedData);
};

const removeItem = keyword => {
  localStorage.removeItem(keyword);
};

setItem.propTypes = {
  keyword: PropTypes.string,
  value: PropTypes.string,
};

getItem.propTypes = {
  keyword: PropTypes.string,
  defaultValue: PropTypes.string,
};

removeItem.propTypes = {
  keyword: PropTypes.string,
};

export { setItem, getItem, removeItem };
