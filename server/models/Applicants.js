const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Accounts = require('./Accounts');
const Applications = require('./Applications');

const ApplicantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  education: [
    {
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
        default: '----',
      },
    },
  ],
  skills: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});

//applicant: this._id, status: 'Applied' 
ApplicantSchema.virtual('applied_applications',{
  ref: 'Applications',
  localField: '_id',
  foreignField: 'applicant',
  count: true
});

ApplicantSchema.virtual('active').get(() => {
  return Applications.countDocuments({ applicant: this, status: 'Accepted' }) > 0;
});

module.exports = Accounts.discriminator('applicants', ApplicantSchema);
