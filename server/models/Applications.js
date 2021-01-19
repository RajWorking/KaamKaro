const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateText = require('./resources/validators')

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
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateText, 'Crossed word limit!'],
    required: true
  },
  status: {
    type: String,
    enum: ['Rejected', 'Accepted', 'Applied', 'Shortlisted'],
    default: 'Applied'
    // Applied is same as Pending
  },
  joining_date: {
    type: Date,
    default: null
  },
  appliation_date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('applications', ApplicationSchema);
