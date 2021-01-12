const express = require('express');
const mongoose = require('mongoose');
const Port = 5000;
const app = express();

const applicantsapi = require('./routes/api/applicantsapi');

app.use(express.json());

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.use('/api/applicants', applicantsapi);

app.listen(Port, () => console.log(`server started on port ${Port}`));
