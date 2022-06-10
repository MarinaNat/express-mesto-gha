const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62a1dac70b3144cc6feef0d0',
    // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

// app.get('/', (req, res) => {
//   res.send('<h1>Домашняя страница</h1>');
// });

// подключаемся к серверу mongo
// mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true, family: 4 });

// app.listen(PORT, () => {
//   // Если всё работает, консоль покажет, какой порт приложение слушает
//   console.log(`App listening on port ${PORT}`);
// });
mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true, family: 4 })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App started on ${PORT} port`);
    });
  }).catch((e) => console.log(e));
