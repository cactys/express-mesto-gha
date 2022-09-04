const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id);

  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.cardId;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError();
      }
      res.status(200).send({ data: card, message: 'DELETE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточки не найдена' });
      }
      if (err.name === 'ReferenceError') {
        return res.status(404).send({ message: 'Карточки не найдена' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId }, // добавить _id в массив, если его там нет
    },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError();
      }
      res.status(200).send({ data: card, message: 'LIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточки не найдена' });
      }
      if (err.name === 'ReferenceError') {
        return res.status(404).send({ message: 'Карточки не найдена' });
      }
      res.status(500).send({ message: err.name });
    });
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: userId }, // убрать из массива
    },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError();
      }
      res.status(200).send({ data: card, message: 'DISLIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Карточки не найдена' });
      }
      if (err.name === 'ReferenceError') {
        return res.status(404).send({ message: 'Карточки не найдена' });
      }
      res.status(500).send({ message: err.message });
    });
};
