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
    const job_list = await Job.find({ deadline: { $gte: new Date() } });

    const changedJob = async (job) => {
      const existing = await Application.countDocuments({ applicant: user._id, job: job._id });
      if (existing) job.status = 'Applied';
      return job;
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

    res.status(201).json({
      id: savedJob._id,
      title: savedJob.title,
      recruiter: savedJob.recruiter,
    });
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

      const job_st = await Application.countDocuments({ job: job._id });
      if (job.status == 'Full') throw Error('Full');
      else if (job_st+1 >= job.max_applications) job.status = 'Full';
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
      const applications_list = await Application.find({ job: req.params.id }).populate('applicant');
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
  .put(auth, async (req, res) => {
    try {
      const user = await Recruiter.findById(req.user.id);
      if (!user) throw Error('Invalid Recruiter');

      const { title, max_applications, max_positions, deadline, req_skills, job_type, duration, salary } = req.body;

      const updatedJob = new Job({
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

      const accepted_applications = await Application.find({ job: updated._id, status: 'Accepted' });
      const recieved_applications = await Application.find({ job: updated._id, status: 'Applied' });

      if (accepted_applications > max_positions) throw Error('Invalid operation');
      else if (accepted_applications == max_positions) status = 'Completed';
      else {
        if (recieved_applications < max_applications) status = 'Apply';
        else if (recieved_applications > max_applications) throw Error('Invalid operation');
        else status = 'Full';
      }

      const updated = await Job.findOneAndUpdate({ _id: req.params.id }, updatedJob, {
        new: true,
      });
      if (!updated) throw Error('Unknown job');

      res.status(200).json(updated);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  });

module.exports = router;

router.patch('/decide/:id', auth, async (req, res) => {
  try {
    const user = await Recruiter.findById(req.user.id);
    if (!user) throw Error('Invalid Recruiter');

    const application = await Application.findById(req.params.id);
    if (!application) throw Error('No such Application');

    const job = await Job.findById(application.job);
    if (!job) throw Error('Application has no job');

    const recieved_applications = await Application.find({ job: job._id, status: 'Applied' });
    if (recieved_applications >= job.max_applications) job.status = 'Full';

    const accepted_applications = await Application.find({ job: job._id, status: 'Accepted' });
    if (accepted_applications >= job.max_positions) {
      job.status = 'Complete';
      await Application.updateMany({ status: { $not: 'Accepted' } }, { $set: { status: 'Rejected' } });
    }

    application.status = req.body.status;
    if (application.status == 'Accept') {
      application.joining_date = new Date();
    }

    res.status(200).json({ id: application._id, status: application.status });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});
