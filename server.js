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
  res.send('Server is running.');
});

app.post('/login', async (req, res) => {
  console.log('/login');
  const phone = Number(req.body.phone);
  const token = jwt.sign({ phone }, 'randomstringnoonecanguess');
  // check if new user or existing user
  let isNewUser;
  try {
    isNewUser = await User.find({ phone });
    console.log('======isNewUser', phone, isNewUser);
  } catch (error) {
    res.json({ error });
  }
  if (isNewUser.length === 0) {
    // save new user
    const newUser = new User({ phone });
    console.log('====', newUser);
    newUser
      .save()
      .then(() => {
        res.status(200).json({ token, phone, isNewUser: true });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  } else {
    // existing user
    res.status(200).json({ token, phone, isNewUser: false });
  }
});

app.get('/init', authMiddleware, (req, res) => {
  console.log('/init');
  const jwtDecodedValue = req.jwtDecodedValue;
  if (jwtDecodedValue) res.status(200).json({ data: 'Welcome to our page!' });
  else res.status(401).json({ data: 'You are not authorized. Login again' });
});

app.use('/users', usersRoute);

// app.post('/addUser', (req, res) => {
//   const data = req.body;
//   const newUser = new User(data);

//   newUser
//     .save()
//     .then(() => res.json({ success: true, message: 'Added user to database.' }))
//     .catch((err) => res.json({ error: err }));
// });

// app.put('/updateUser', async (req, res) => {
//   const name = req.body.name;
//   const data = await User.findOneAndUpdate(
//     { name },
//     { username: req.body.username },
//     { new: true, runValidators: true }
//   );

//   res.status(200).json({ success: true, data });
// });

// app.post('/modifyUser', async (req, res) => {
//   try {
//     const x = await User.updateMany({}, { $unset: { id: 2 } });
//     res.json({ data: x });
//   } catch (err) {
//     console.log('===err', err);
//     res.json({ error: err });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server listening at', PORT);
});
