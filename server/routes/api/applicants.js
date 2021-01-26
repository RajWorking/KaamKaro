const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const router = express.Router();

const User = require('../../models/Applicants');
const Account = require('../../models/Accounts');
const Application = require('../../models/Applications');

router.get('/all', (req, res) => {
  User.find().then((items) => res.json(items));
});

router.post('/register', async (req, res) => {
  const { name, email, password, skills, education } = req.body;

  if (!name || !email || !password) {
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
router
  .route('/profile')
  .get(auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  })
  .put(auth, async (req, res) => {
    const { name, email, password, skills, education } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    try {
      const user = await Account.findOne({ email });
      if (user !== null && user._id != req.user.id) throw Error('Already existing account');

      const salt = await bcrypt.genSalt(10);
      if (!salt) throw Error('Messed up Bcrypt');

      const hash = await bcrypt.hash(password, salt);
      if (!hash) throw Error('Messed up in hashing password');

      const newUser = new User({
        _id: req.user.id,
        name,
        email,
        education,
        skills,
        password: hash,
      });

      await User.updateOne({ _id: req.user.id }, newUser);

      res.status(201).json(newUser);
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

router.patch('/rate/:id', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating) throw Error('Give some rating');

    await Application.updateOne({ _id: req.params.id }, { $set: { rating_recruiter: rating } });

    res.status(200).json({ rating: rating });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
