const express = require('express');
const router = express.Router();
const User = require('./../models/User');

router.get('/', async (req, res) => {
  const age = Number(req.query.age);
  try {
    const data = age ? await User.find({ age }) : await User.find();
    res.json({ success: true, data });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;
