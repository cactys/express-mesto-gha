const User = require('../models/user');
const { STATUS_CODE_200, ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } =
  process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(ERROR_CODE_500).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError();
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE_400)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err.name === 'ReferenceError') {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.status(ERROR_CODE_500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_CODE_400)
          .send({ message: 'Некорректные данные' });
      }
      res.status(ERROR_CODE_500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError();
      }
      res.status(STATUS_CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_CODE_400)
          .send({ message: 'Некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err.name === 'ReferenceError') {
        return res
          .status(ERROR_CODE_404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.status(ERROR_CODE_500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_CODE_200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_CODE_400)
          .send({ message: 'Некорректные данные' });
      }
      res.status(ERROR_CODE_500).send({ message: err.message });
    });
};
