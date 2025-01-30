const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validateSubscriptionType = (type) => {
  return ["1-meal-per-week", "2-meals-per-week"].includes(type);
};

module.exports = { validateEmail, validatePassword, validateSubscriptionType };
