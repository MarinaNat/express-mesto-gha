const User = require('../models/user');

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const ERROR_DEFOULT = 500;

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send({ users }))
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
      if (err.name === 'InvalidId') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(ERROR_DEFOULT).send({ message: err.message });
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.send({ newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE).send({ message: err.message });
      return res.status(ERROR_DEFOULT).send({ message: err.message });
    });
};

module.exports.putchUserProfile = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { $set: { avatar } }, { new: true, runValidator: true })
    .then((userProfile) => {
      if (!userProfile) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: userProfile });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFOULT).send({ message: err.message });
    });
};

module.exports.putchUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { $set: { avatar } }, { new: true, runValidator: true })
    .then((userAvatar) => {
      if (!userAvatar) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: userAvatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFOULT).send({ message: err.message });
    });
};
