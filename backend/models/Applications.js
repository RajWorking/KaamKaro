const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Jobs = require('./Jobs');
const Applicants = require('./Applicants');
const text = require('./resources/text');

const ApplicationSchema = new Schema({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'Jobs',
  },
  applicant: {
    type: Schema.Types.ObjectId,
    ref: 'Applicants',
  },
  sop: {
    type: text,
  },
  status: {
    type: String,
    enum: ['Rejected', 'Accepted', 'Applied', 'Shortlisted'],
    // Applied is same as Pending
  },
});

module.exports = Application = mongoose.model('appications', ApplicationSchema);
