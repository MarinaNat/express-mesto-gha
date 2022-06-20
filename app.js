const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const helmet = require('helmet');
const dotenv = require('dotenv');
const { putError } = require('./utils/error');

dotenv.config();
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./utils/errors/not-found-err');
const { Authorized } = require('./middlewares/auth');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      avatar: Joi.string().uri().custom((value, helper) => {
        if (value !== value.match(/(http|https):\/\/(www\.|)\S+/g).join('')) {
          return helper.message('Неверный формат ссылки');
        }
        return value;
      }),
    }),
  }),
  createUser,
);

app.use('/users', Authorized, userRouter);
app.use('/cards', Authorized, cardRouter);

// Обработчик 404-ошибки
app.use(Authorized, (req, res, next) => next(new NotFoundError('Cтраница не найдена')));

app.use(errors());
app.use(putError);

app.listen(PORT, () => {
  console.log(`App started on ${PORT} port`);
});
