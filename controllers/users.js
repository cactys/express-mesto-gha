const User = require('../models/user');
const {
  ERROR_500,
  ERROR_400,
  CODE_200,
  ERROR_404,
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
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Некорректные данные' });
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
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
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
        return res
          .status(ERROR_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};
