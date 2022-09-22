const validator = require('validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Должно быть, не меньше 2 символа, получено {VALUE}'],
      maxlength: [30, 'Должно быть, не больше 30 символов, получено {VALUE} '],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Должно быть, не меньше 2 символа, получено {VALUE}'],
      maxlength: [30, 'Должно быть, не больше 30 символов, получено {VALUE} '],
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Неправильный формат почты',
      },
    },
  },
  {
    toObject: {
      useProjection: true,
      versionKey: false,
    },
  },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
