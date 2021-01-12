const express = require('express');
const router = express.Router();

const User = require('../../models/Applicants');

router.get('/', (req, res) => {
  User.find().then((items) => res.json(items));
});

// router.post('/', (req, res) => {
//   const newuser = new User({
//     name: req.body.name,
//     email: req.body.email,
//     date: req.body.date
//   });

//   newuser
//     .save()
//     .then((item) => res.json(item))
//     .catch((err) => res.status(404).json(err));
// });

module.exports = router;
