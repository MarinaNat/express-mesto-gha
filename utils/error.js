const validator = require('validator');

const putError = (err, req, res, next) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .send({ message: err.message || 'Что-то пошло не так' });
  }
  res.status(500).send({ message: 'Ошибка сервера' });
  return next(err);
};

// валидация URL
const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неверный формат ссылки');
  }
  return value;
};

module.exports = {
  putError,
  validateURL,
};
