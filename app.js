const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cards = require('./routes/cards');
const { login, createUser, getUserId } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { ERROR_500 } = require('./utils/code');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/users/me', getUserId);
app.use('/cards', cards);

app.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

app.use(errors());
app.use((err, req, res, next) => {
  res
    .status(ERROR_500)
    .send({
      message: ERROR_500 === 500
        ? 'На сервере произошла ошибка'
        : err.message,
    });

  next();
});
