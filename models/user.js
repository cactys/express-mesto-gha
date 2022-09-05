const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть, не меньше 2 символа, получено {VALUE}'],
    maxlength: [30, 'Должно быть, не больше 30 символов, получено {VALUE} '],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть, не меньше 2 символа, получено {VALUE}'],
    maxlength: [30, 'Должно быть, не больше 30 символов, получено {VALUE} '],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
