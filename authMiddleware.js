const jwt = require('jsonwebtoken');
const User = require('./models/User');

const authMiddleware = async function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'somerandomtext');
    console.log('======jwt decoded success', decoded);
    req.jwtDecodedValue = decoded;
    const isUserPresent = await User.findById(decoded.id);
    console.log('=======isUserPresent', isUserPresent.phone);
    if (isUserPresent) next();
    else {
      // dont call next()
      res.status(404).json({ data: `User ${id} does not exist!` });
    }
  } catch (err) {
    console.log('======jwt decoded error', err);
    req.jwtDecodedValue = '';
    next();
  }
};

module.exports = authMiddleware;
