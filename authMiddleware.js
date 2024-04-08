const jwt = require('jsonwebtoken');
const User = require('./models/User');

const authMiddleware = async function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  const id = req.body.id; // mongoose id
  const isUserPresent = await User.findById(req.body.id);
  console.log('=======isUserPresent', isUserPresent);
  if (isUserPresent) {
    try {
      const decoded = jwt.verify(token, id);
      console.log('======jwt decoded success', decoded);
      req.jwtDecodedValue = decoded;
    } catch (err) {
      console.log('======jwt decoded error', err);
      req.jwtDecodedValue = '';
    } finally {
      next();
    }
  } else {
    // dont call next()
    res.status(404).json({ data: `User ${id} does not exist!` });
  }
};

module.exports = authMiddleware;
