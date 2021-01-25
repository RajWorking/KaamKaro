const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const router = express.Router();

const User = require('../../models/Applicants');
const Application = require('../../models/Applications');
const Job = require('../../models/Jobs');

router.get('/all', (req, res) => {
  User.find().then((items) => res.json(items));
});

router.post('/register', async (req, res) => {
  const { name, email, password, skills, education } = req.body;

  if (!name || !email || !password || !education) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
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
      education,
      skills,
      password: hash,
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Messed up saving user');

    const token = jwt.sign({ id: savedUser._id }, config.get('jwtSecret'), { expiresIn: 3600 });

    res.status(201).json({
      token,
      type: 'applicants',
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get('/myapplications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw Error('Invalid User');

    const application = await Application.find({ applicant: user._id }).populate({
      path: 'job',
      model: 'jobs',
      populate: {
        path: 'recruiter',
        model: 'recruiters',
      },
    });

    res.status(200).json(application);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
