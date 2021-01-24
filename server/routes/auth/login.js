const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../../models/Accounts');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) throw Error('Please register! This User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, config.get('jwtSecret', { expiresIn: 36000 }));
    if (!token) throw ErrorEvent('Couldnt sign the token');

    res.status(200).json({
      token,
      type: user.user_type
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
