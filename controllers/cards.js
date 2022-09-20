const Card = require('../models/card');
const {
  ERROR_500,
  ERROR_400,
  CODE_200,
  ERROR_404,
} = require('../utils/code');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_500).send({ message: 'Что-то пошло не так' }));
};

module.exports.createCard = (req, res) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Некорректные данные' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        return res
          .status(ERROR_404)
          .send({ message: 'Картачка не найдена' });
      }
      return res.status(CODE_200).send({ data: card, message: 'DELETE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Картачка не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId }, // добавить _id в массив, если его там нет
    },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res
          .status(ERROR_404)
          .send({ message: 'Картачка не найдена' });
      }
      return res.status(CODE_200).send({ data: card, message: 'LIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Картачка не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: userId }, // убрать из массива
    },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res
          .status(ERROR_404)
          .send({ message: 'Картачка не найдена' });
      }
      return res.status(CODE_200).send({ data: card, message: 'DISLIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(ERROR_400)
          .send({ message: 'Картачка не найдена' });
      }
      return res.status(ERROR_500).send({ message: 'Что-то пошло не так' });
    });
};
