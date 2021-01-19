const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateText = function (text) {
  let words = 0;
  for (var i = 0; i < text.length; i++) {
    if (i > 0 && text[i] == ' ' && text[i - 1] != ' ') words++;
  }
  return words <= 250;
};

module.exports = validateText;
