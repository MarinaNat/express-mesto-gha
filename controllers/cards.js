const Card = require('../models/card');

const {
  ERROR_CODE,
  NOT_FOUND,
  ERROR_DEFOULT,
} = require('../utils/error');

// Запрос всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_DEFOULT).send({ message: 'Ошибка на сервере' }));
};

// Создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // const { _id } = req.user;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Ошибка сервера' });
    });
};

// Удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Картока не найдена' });
        return;
      }
      res.send({ message: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Ошибка сервера' });
    });
};

// Добавления лайка
module.exports.likeCard = (req, res) => {
  // const { _id } = req.user;
  // const { cardId } = req.params;
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Картока не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Ошибка сервера' });
    });
};

// Снятие лайка с карточки
module.exports.dislikeCard = (req, res) => {
  // const { _id } = req.user;
  // const { cardId } = req.params;
  // убрать _id из массива
  Card.findOneAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Картока не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Ошибка сервера' });
    });
};
