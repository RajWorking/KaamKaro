const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Accounts = require('./resources/Accounts')

const education = new Schema({
  institute: {
    type: String,
    required: true,
  },
  start_year: {
    type: String,
    required: true,
  },
  end_year: {
    type: String,
  },
});

const ApplicantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: Schema.Types.ObjectId,
    ref: 'Accounts'
  },
  education: education,
  skills: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});

module.exports = Applicant = mongoose.model('applicants', ApplicantSchema);
