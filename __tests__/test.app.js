/* eslint-disable no-undef */
const mongoose = require('mongoose');
const User = require('../models/user');

const MONGO_URL = 'mongodb://localhost:27017/mestodb';
const fixtures = {
  user: {
    name: 'Вася',
    about: 'Фронтенд',
    password: '1234QWer$',
    email: 'vasya-frontend@yandex.ru',
    avatar: 'http://rai77.com/upload/000/u1/4f/88/selfi-s-samoi-schastlivoi-kvokkoi-v-mire-sdelal-amerikanskii-turi.jpg',
  },
};

beforeAll(() => {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
  });
});

afterAll(() => mongoose.disconnect());

describe('Database tests', () => {
  beforeEach(() => {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = fixtures.user;

    return User.create({
      name,
      about,
      avatar,
      email,
      password,
    });
  });

  afterEach(() => User.deleteOne({ email: fixtures.user.email }));

  it('Пользователь должен быть', () => User.findOne({ email: fixtures.user.email })
    .then((user) => {
      expect(user).toBeDefined();
      expect(user.email).toBe(fixtures.user.email);
      expect(user.name).toBe(fixtures.user.name);
    }));
});
