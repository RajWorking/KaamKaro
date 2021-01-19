const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/Recruiters');
const Job = require('../../models/Jobs');
const Applications = require('../../models/Applications');

router.get('/all', (req, res) => {
  User.find().then((items) => res.json(items));
});

router.post('/register', async (req, res) => {
  const { name, email, password, contact, bio } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) throw Error('Already existing account');

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Messed up Bcrypt');

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error('Messed up in hashing password');

    const newUser = new User({
      name,
      email,
      contact,
      bio,
      password: hash,
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Messed up saving user');

    const token = jwt.sign({ id: savedUser._id }, config.get('jwtSecret'), { expiresIn: 3600 });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/myjobs', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw Error('You cannot post a job');
    
    const myjobs = Job.find({ recruiter: user._id }).where('status').nin(['Completed']);
    res.status(200).json(myjobs);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get('/employees', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw Error('You cannot post a job');

    const employees = Applications.find({recruiter: user._id, status: 'Accepted'})
    res.status(200).json(employees)
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
