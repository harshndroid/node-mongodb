const jwt = require('jsonwebtoken');

const authMiddleware = function (req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'randomstringnoonecanguess');
    console.log('======jwt decoded success', decoded);
    req.jwtDecodedValue = decoded;
  } catch (err) {
    console.log('======jwt decoded error', err);
    req.jwtDecodedValue = '';
  } finally {
    next();
  }
};

module.exports = authMiddleware;
