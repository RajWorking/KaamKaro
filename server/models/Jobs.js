const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Applications = require('./Applications');

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: 'recruiters',
  },
  max_applications: Number,
  max_positions: {
    type: Number,
    default: 1,
  },
  date_posted: {
    type: Date,
    default: Date.now(),
  },
  deadline: Date,
  req_skills: [String],
  job_type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Work from Home'],
  },
  duration: Number, //months
  salary: Number, // per month
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  status: {
    type: String,
    enum: ['Full', 'Apply', 'Complete'],
    default: 'Apply',
  },
});

JobSchema.pre('deleteOne', async function (next) {
  try {
    const kk = await Applications.deleteMany({ job: this._conditions._id });
    next();
  } catch (err) {
    next(err);
  }
});

Job = mongoose.model('jobs', JobSchema);
module.exports = Job;
