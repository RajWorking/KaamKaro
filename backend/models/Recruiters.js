const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const text = require('./resources/text');
const Accounts = require('./resources/Accounts');

const RecruiterSchema = new Schema({
  name: String,
  email: {
    type: Schema.Types.ObjectId,
    ref: 'Accounts',
  },
  contact: {
    type: String,
    minLength: 10,
    maxLength: 10,
  },
  bio: text,
});

module.exports = Recruiter = mongoose.model('recruiters', RecruiterSchema);
