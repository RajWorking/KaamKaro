const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Recruiters = require('./Recruiters');
const Applications = require('./Applications');

const JobSchema = new Schema({
  active: Boolean,
  title: {
    type: String,
    required: true,
  },
  recruiter: {
    type: Schema.Types.ObjectId,
    ref: 'Recruiters',
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
});

JobSchema.pre('remove', function (next) {
  return Applications.deleteMany({ job: this._id }).catch((err) => console.log(err));
});

module.exports = Job = mongoose.model('jobs', JobSchema);
