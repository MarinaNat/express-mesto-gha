const User = require('../models/user');

const {
  ERROR_CODE,
  NOT_FOUND,
  ERROR_DEFOULT,
} = require('../utils/error');

module.exports.getUsers = (_req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_DEFOULT).send({ message: 'Ошибка сервера' }));
};

module.exports.getUser = (req, res) => {
  // const { _id } = req.params;
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Ошибка на сервере' });
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'пользователь не найден' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Сбой на сервере' });
    });
};

module.exports.putchUserProfile = (req, res) => {
  const { name, about } = req.body;
  // const { _id } = req.user;
  // const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidator: true })
    .then((userProfile) => {
      if (!userProfile) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(userProfile);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Ошибка сервера' });
    });
};

module.exports.putchUserAvatar = (req, res) => {
  // const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidator: true })
    .then((userAvatar) => {
      if (!userAvatar) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(userAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_DEFOULT).send({ message: 'Сервер не отвечает' });
    });
};
