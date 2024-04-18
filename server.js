const express = require('express');
const app = express();

require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const authMiddleware = require('./authMiddleware');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const jwt = require('jsonwebtoken');
const User = require('./models/User');
const usersRoute = require('./routes/usersRoute');

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.post('/login', async (req, res) => {
  console.log('/login');
  const phone = Number(req.body.phone);

  // check if new user or existing user
  let newUser;
  try {
    newUser = await User.find({ phone });
    console.log('======newUser', phone, newUser);
  } catch (error) {
    res.status(500).json({ error });
  }
  if (newUser) {
    if (newUser.length === 0) {
      // save new user
      const addNewUser = new User({ phone });
      addNewUser
        .save()
        .then((data) => {
          const token = jwt.sign({ phone, id: data.id }, 'somerandomtext');
          res
            .status(200)
            .json({ token, phone, userId: data.id, isNewUser: true });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    } else {
      // existing user
      console.log('existing user id', newUser[0].id);
      const token = jwt.sign({ phone, id: newUser[0].id }, 'somerandomtext');
      res
        .status(200)
        .json({ token, phone, userId: newUser[0].id, isNewUser: false });
    }
  } else {
    res
      .status(500)
      .json({ error: 'newUser is undefined - issue in database conn' });
  }
});

app.post('/init', authMiddleware, async (req, res) => {
  console.log('/init', req.body);
  const jwtDecodedValue = req.jwtDecodedValue;
  if (jwtDecodedValue) {
    const id = req.body.id; // mongoose id
    const data = await User.findByIdAndUpdate(
      id,
      { location: req.body.location, lastSeenAt: req.body.lastSeenAt },
      { new: true, runValidators: true }
    );

    const userData = await User.findById(id);

    console.log('====userData', userData);
    res.status(200).json({ data: userData });
  } else res.status(401).json({ data: 'You are not authorized. Login again' });
});

app.post('/updateUserProfile', authMiddleware, async (req, res) => {
  console.log('/updateUserProfile', req.body);
  const jwtDecodedValue = req.jwtDecodedValue;
  if (jwtDecodedValue) {
    const id = jwtDecodedValue.id; // mongoose id
    const data = await User.findByIdAndUpdate(
      id,
      { photoUrl: req.body.photoUrl, name: req.body.name, age: req.body.age },
      { new: true, runValidators: true }
    );
    res.status(200).json({ data });
  } else res.status(401).json({ data: 'You are not authorized. Login again' });
});

app.use('/nearbyTravellers', usersRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('server listening at', PORT);
});
