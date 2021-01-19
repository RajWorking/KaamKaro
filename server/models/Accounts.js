const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const AccountSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email is required!',
      validate: [validateEmail, 'Invalid Email!'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { discriminatorKey: 'user_type' }
);

module.exports = mongoose.model('Accounts', AccountSchema);
