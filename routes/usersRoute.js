const express = require('express');
const router = express.Router();
const User = require('./../models/User');

router.get('/', async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error });
  }
});

module.exports = router;
