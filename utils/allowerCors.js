const allowedCors = [
  'http://khortys.nomoredomains.icu/',
  'https://khortys.nomoredomains.icu/',
  'http://localhobdfbst:3000',
  'https://localhobdfbst:3000',
];

const DEFAULT_ALLOWED_METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

module.exports = {
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
