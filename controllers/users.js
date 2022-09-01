const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .populate('user')
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  const { name, userId } = req.body;

  User.find({ name, owner: userId })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body();

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
