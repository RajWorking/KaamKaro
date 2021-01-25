const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/Recruiters');
const Job = require('../../models/Jobs');
const Application = require('../../models/Applications');
const Recruiter = require('../../models/Recruiters');

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
      type: "recruiters"
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get('/myjobs', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw Error('You cannot post a job');

    const myjobs = await Job.find({ recruiter: user._id }).where('status').nin(['Complete']);

    const changedJob = async (job) => {
      const fix_job = job.toObject();
      fix_job.date_posted = moment(job.date_posted).format('YYYY-MM-DD');
      const accepted = await Application.countDocuments({ job: job._id, status: 'Accepted' });
      fix_job.max_positions = Math.max(0, job.max_positions - accepted);
      const current_applications = await Application.countDocuments({ job: job._id, status: { $ne: 'Rejected' } });
      fix_job.current_applications = current_applications;
      return fix_job;
    };

    const data = await Promise.all(myjobs.map((job) => changedJob(job)));

    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get('/employees', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw Error('You cannot post a job');

    const jobs = await Job.find({ recruiter: user._id });
    const job_ids = jobs.map((job) => job._id);
    const employees = await Application.find({ status: 'Accepted', job: { $in: job_ids } })
      .populate('job')
      .populate('applicant');

    res.status(200).json(employees);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.patch('/decide/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const user = await Recruiter.findById(req.user.id);
    if (!user) throw Error('Invalid Recruiter');

    const application = await Application.findById(id);
    if (!application) throw Error('No such Application');

    const job = await Job.findById(application.job);
    if (!job) throw Error('Application has no job');
    else if (job.status === 'Complete') throw Error('Inactive job');

    if (!status || status === 'Applied') throw Error('Please make a decision!');
    else if (application.status === 'Accepted') throw Error('Already an employee!');
    else if (application.status === 'Rejected') throw Error('Already rejected!');
    else if (application.status === 'Applied' && status === 'Accepted') throw Error('PLease waitlist first!');

    await Application.updateOne({ _id: id }, { $set: { status: status } });

    if (status === 'Rejected') {
      const recieved_applications = await Application.find({ job: job._id, status: { $ne: 'Rejected' } });
      if (recieved_applications.length < job.max_applications) job.status = 'Apply';
    } else if (status === 'Accepted') {
      await Application.updateOne({ _id: id }, { $set: { joining_date: new Date() } });

      const accepted_applications = await Application.find({ job: job._id, status: 'Accepted' });
      if (accepted_applications.length >= job.max_positions) {
        job.status = 'Complete';
        await Application.updateMany({ job: job._id, status: { $ne: 'Accepted' } }, { $set: { status: 'Rejected' } });
      }
      await Application.updateMany(
        { applicant: application.applicant, status: { $ne: 'Accepted' } },
        { $set: { status: 'Rejected' } }
      );
    }
    await Job.updateOne({ _id: job._id }, job);

    res.status(200).json(job);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
