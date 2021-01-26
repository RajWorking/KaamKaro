const express = require('express');
const config = require('config');
const router = express.Router();

const Recruiter = require('../../models/Recruiters');
const Applicant = require('../../models/Applicants');
const Application = require('../../models/Applications');
const Job = require('../../models/Jobs');
const auth = require('../../middleware/auth');

router.get('/view', auth, async (req, res) => {
  try {
    const user = await Applicant.findById(req.user.id);
    if (!user) throw Error('Invalid Applicant');
    const job_list = await Job.find({ deadline: { $gte: new Date() } }).populate('recruiter');

    const changedJob = async (job) => {
      const fix_job = job.toObject();
      const existing = await Application.countDocuments({ applicant: user._id, job: job._id });
      if (existing) fix_job.status = 'Applied';
      var value = await Application.aggregate([
        { $match: { status: 'Accepted', job: job._id } },
        { $group: { _id: '$job', avg: { $avg: '$rating_recruiter' } } },
      ]);
      fix_job.avg_rating = value.length==0?'unrated':value[0].avg
      return fix_job;
    };

    const data = await Promise.all(job_list.map((job) => changedJob(job)));

    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const user = await Recruiter.findById(req.user.id);
    if (!user) throw Error('Invalid Recruiter');

    const { title, max_applications, max_positions, deadline, req_skills, job_type, duration, salary } = req.body;

    if (salary < 0) throw Error('Unfair play!');
    if (max_applications <= 0 || max_positions <= 0) throw Error('Illogical...');
    if (!job_type || !duration) throw Error('Please Enter all details');

    const newJob = new Job({
      title,
      max_applications,
      max_positions,
      deadline: new Date(deadline),
      req_skills,
      job_type,
      duration,
      salary,
      recruiter: user._id,
    });

    const savedJob = await newJob.save();
    if (!savedJob) throw Error('Messed up creating job');

    res.status(201).json(savedJob);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router
  .route('/:id')
  .post(auth, async (req, res) => {
    try {
      const { sop } = req.body;
      if (!sop) throw Error('No sop found!');

      const user = await Applicant.findById(req.user.id);
      if (!user) throw Error('Only verified users can Apply');

      const active = await Application.countDocuments({ applicant: user._id, status: 'Accepted' });
      if (active) throw Error('Only 1 job at a time');

      const applied_to = await Application.countDocuments({ applicant: user._id, status: { $ne: 'Rejected' } });
      if (applied_to >= config.get('apply_limit')) throw Error('Please do not spam');

      const job = await Job.findById(req.params.id);
      if (!job) throw Error('Invalid job id');

      const recieved_applications = await Application.countDocuments({ job: job._id, status: { $ne: 'Rejected' } });
      if (job.status === 'Full' || job.status === 'Complete') throw Error('Full');
      else if (recieved_applications + 1 >= job.max_applications) job.status = 'Full';
      await Job.updateOne({ _id: req.params.id }, job);

      if (job.deadline.getTime() < Date.now()) throw Error('Deadline passed');

      const existing = await Application.countDocuments({ applicant: user._id, job: job._id });
      if (existing) {
        throw Error('Already applied to this job');
      }

      const newApplication = new Application({
        sop,
        applicant: user._id,
        job: job._id,
      });

      await newApplication.save();

      const data = await newApplication
        .populate({
          path: 'job',
          model: 'jobs',
          populate: {
            path: 'recruiter',
            model: 'recruiters',
          },
        })
        .execPopulate();
      res.status(201).json(data);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  })
  .get(auth, async (req, res) => {
    try {
      const user = await Recruiter.findById(req.user.id);
      if (!user) throw Error('Invalid Recruiter');
      const applications_list = await Application.find({ job: req.params.id, status: { $ne: 'Rejected' } }).populate('applicant');
      res.status(200).json(applications_list);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  })
  .delete(auth, async (req, res) => {
    try {
      const user = await Recruiter.findById(req.user.id);
      if (!user) throw Error('Invalid Recruiter');
      const removed = await Job.deleteOne({ _id: req.params.id });
      if (!removed.deletedCount) throw Error('Job doesnt exist');

      res.status(200).json(removed);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  })
  .patch(auth, async (req, res) => {
    try {
      const user = await Recruiter.findById(req.user.id);
      const id = req.params.id;

      if (!user) throw Error('Invalid Recruiter');

      const { max_applications, max_positions, deadline } = req.body;
      console.log(req.body);

      if (!max_applications || !max_positions || !deadline) throw Error('Missing details.');

      const accepted_applications = await Application.countDocuments({ job: id, status: 'Accepted' });
      const recieved_applications = await Application.countDocuments({ job: id, status: { $ne: 'Rejected' } });

      if (accepted_applications > max_positions) throw Error('Invalid operation');
      else if (accepted_applications == max_positions) status = 'Completed';
      else {
        if (recieved_applications < max_applications) status = 'Apply';
        else if (recieved_applications > max_applications) throw Error('Invalid operation');
        else status = 'Full';
      }
      await Job.updateOne(
        { _id: id },
        { $set: { max_applications: max_applications, max_positions: max_positions, deadline: new Date(deadline) } }
      );
      const job = await Job.findById(id);
      res.status(200).json(job);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  });

module.exports = router;
