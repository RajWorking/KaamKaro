const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const EmailSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email is required!',
    validate: [validateEmail, 'Invalid Email!'],
  },
});

module.exports = account = mongoose.model('accounts', EmailSchema);
