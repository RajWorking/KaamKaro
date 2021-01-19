const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const text = require('./resources/validators');
const Accounts = require('./Accounts');
const validateText = require('./resources/validators');

const RecruiterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    minLength: 10,
    maxLength: 10,
  },
  bio: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateText, 'Crossed word limit!'],
    required: true
  },
});

module.exports = Accounts.discriminator('recruiters', RecruiterSchema);
