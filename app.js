const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const helmet = require('helmet');
const dotenv = require('dotenv');
const { validateURL, putError } = require('./utils/error');

dotenv.config();
const { userRouter } = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./middlewares/auth');
const { Authorized } = require('./middlewares/auth');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62a1dac70b3144cc6feef0d0',
    // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
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
      avatar: Joi.string().custom(validateURL),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
// userRouter.use(Auth);

app.use('/users', Authorized, userRouter);
app.use('/cards', Authorized, cardRouter);
// app.post('/signin', login);
// app.post('/signup', createUser);

// Обработчик 404-ошибки
app.use(Authorized, (req, res, next) => next(new NotFoundError('Cтраница не найдена')));

// Обработчик 500
// app.use((err, req, res) => {
//   const { stutus = 500, message } = err;
//   res
//     .status(stutus)
//     .send({
//       message: stutus === 500
//         ? 'Ошибка сервера'
//         : message,
//     });
// });

app.use(errors());
app.use(putError);

app.listen(PORT, () => {
  console.log(`App started on ${PORT} port`);
});
