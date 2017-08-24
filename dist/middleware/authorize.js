'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyUserSession = verifyUserSession;
exports.verifyAdminStatus = verifyAdminStatus;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Verify if user is currently logged in
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
function verifyUserSession(req, res, next) {
  var token = req.body.token || req.headers.token;
  if (!token) {
    res.status(403).send({ message: 'Session token is required!' });
  } else {
    // Check if token matches the one provided at login
    _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (err) {
      if (err) {
        res.status(500).send({ message: 'Invalid token!' });
      } else {
        next();
      }
    });
  }
}

/**
 * Check if admin status of current user
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
function verifyAdminStatus(req, res, next) {
  var token = req.body.token || req.headers.token;
  if (!token) {
    res.status(401).send({ message: 'Session token is required!' });
  } else {
    // Check if token matches the one provided at login
    _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      // Check id session is of admin
      if (decoded.isadmin !== true) {
        res.status(403).send({ message: 'Forbidden access!' });
      } else next();
    });
  }
}