const express = require('express');
require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
const User = require('./models/User');
const usersRoute = require('./routes/usersRoute');

const app = express();

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.post('/addUser', (req, res) => {
  const data = req.body;
  const newUser = new User(data);

  newUser
    .save()
    .then(() => res.json({ success: true, message: 'Added user to database.' }))
    .catch((err) => res.json({ error: err }));
});

app.use('/users', usersRoute);

app.put('/updateUser', async (req, res) => {
  const name = req.body.name;
  const data = await User.findOneAndUpdate(
    { name },
    { username: req.body.username },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data });
});

app.post('/modifyUser', async (req, res) => {
  try {
    const x = await User.updateMany({}, { $unset: { id: 2 } });
    res.json({ data: x });
  } catch (err) {
    console.log('===err', err);
    res.json({ error: err });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server listening at', PORT);
});
