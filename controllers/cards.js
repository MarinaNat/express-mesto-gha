const Card = require('../models/card');

const {
  ERROR_CODE,
  NOT_FOUND,
  ERROR_DEFOULT,
} = require('../utils/error');

// Запрос всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(ERROR_DEFOULT).send({ message: err.message }));
};

// Создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFOULT).send({ message: err.message });
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  const { _id } = req.user;
  Card.findOneAndDelete(_id)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Картока не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => res.status(ERROR_DEFOULT).send({ message: err.message }));
};

// Добавления лайка
module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Картока не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFOULT).send({ message: err.message });
    });
};

// Снятие лайка с карточки
module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  // убрать _id из массива
  Card.findOneAndUpdate(cardId, { $pull: { likes: _id } }, { new: true, runValidators: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Картока не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFOULT).send({ message: err.message });
    });
};
