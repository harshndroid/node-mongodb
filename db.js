const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  // .connect('mongodb://localhost:27017/soulfinder')
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Connected failed!', err);
  });
