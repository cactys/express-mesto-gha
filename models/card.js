const mongoose = require('mongoose');
const user = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть, не меньше 2 символа, получено {VALUE}'],
    maxlength: [30, 'Должно быть, не больше 30 символов, получено {VALUE} '],
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    ref: user,
    require: true,
  },
  likes: [{
    type: mongoose.ObjectId,
    ref: user,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
