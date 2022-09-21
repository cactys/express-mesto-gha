const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-err');
const Card = require('../models/card');
const { CODE_200 } = require('../utils/code');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Картачка не найдена');
      }
      if (card.owner.toString() !== ownerId) {
        throw new ForbiddenError();
      }
      return res.status(CODE_200).send({ data: card, message: 'DELETE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Картачка не найдена'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
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
        throw new NotFoundError('Картачка не найдена');
      }
      return res.status(CODE_200).send({ data: card, message: 'LIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Картачка не найдена'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        throw new NotFoundError('Картачка не найдена');
      }
      return res.status(CODE_200).send({ data: card, message: 'DISLIKE' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Картачка не найдена'));
        return;
      }
      next(err);
    });
};
