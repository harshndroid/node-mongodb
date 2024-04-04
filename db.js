const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  // .connect('mongodb://localhost:27017', { family: 4 })
  .connect(
    'mongodb+srv://harshsuman0802:node-mongodb123@node-mongodb.v5kghef.mongodb.net/'
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Connected failed!', err);
  });
// mongoose.connect(process.env.MONGO_DB_URL);

// const db = mongoose.connection;

// db.on('connected', () => console.log('Connected to database!'));
// db.on('disconnected', () => console.log('Databse Disconnected!'));
// db.on('error', (err) => console.log('Connected failed!', err));
