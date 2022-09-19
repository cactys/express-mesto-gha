const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_500, ERROR_400, CODE_200, ERROR_404, ERROR_401,
} = require('../utils/code');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_500).send({ message: 'Что-то пошло не так' }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user === null) {
        return res.status(ERROR_404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.createUser = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({
          message: 'Некорректные данные',
        });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        return res.status(ERROR_404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({
          message: 'Некорректные данные',
        });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({
          message: 'Некорректные данные',
        });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => res.status(ERROR_401).send(({ message: 'Что-то пошло не так' })));

  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       return Promise.reject(new Error('Неправильные почта или пароль'));
  //     }

  //     return bcrypt.compare(password, user.password);
  //   })
  //   .then((matched) => {
  //     if (!matched) {
  //       return Promise.reject(new Error('Неправильные почта или пароль'));
  //     }

  //     return res.send({ message: 'Успех!' });
  //   })
  //   .catch(() => {
  //     res.status(ERROR_401).send(({ message: 'Что-то пошло не так' }));
  //   });
};
