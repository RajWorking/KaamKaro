const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const Port = config.get('PORT');
const app = express();

const login = require('./routes/auth/login');

app.use(cors());
app.use(express.json());

const db = config.get('mongoURI');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.use('/auth/login', login);
app.use('/api/applicants', require('./routes/api/applicants'));
app.use('/api/recruiters', require('./routes/api/recruiters'));
app.use('/api/jobs', require('./routes/api/jobs'));

const User = require('./models/Accounts');
app.use('/users', (req, res) => {
  User.find().then((items) => res.json(items));
});

app
  .listen(Port, () => console.log(`server started on port ${Port}`))
  .on('error', (err) => {
    console.log(err);
  }); 
