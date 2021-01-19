const jwt = require('jsonwebtoken');
const config = require('config')

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json({ msg: 'Invalid authorisation @ Token missing' });

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded;
    next();
  } catch (e) {
    console.log(token);
    res.status(400).json({ msg: 'InvalId tokEn' });
  }
}
module.exports = auth;
