'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.createAdminUser = createAdminUser;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _models2.default.User;

/**
 * Handles request for user sign-up
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{undefined}
 */

function createUser(req, res) {
  // Hash password to save in the database
  var password = _bcrypt2.default.hashSync(req.body.password, 10);
  return User.create({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: password,
    membership: 'basic'
  }).then(function (user) {
    return res.status(201).send(user);
  }).catch(function (err) {
    return res.status(400).send(err.errors[0].message + '!');
  });
}

/**
 * Handles request for sign-in with basic authentication
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{undefined}
 */
function loginUser(req, res) {
  return User.findOne({
    where: { username: req.body.username }
  }).then(function (user) {
    _bcrypt2.default.compare(req.body.password, user.password).then(function (check) {
      if (check) {
        res.status(200).send('Successfully Logged in');
      }
      res.status(401).send('Wrong password or username');
    });
  }).catch(function (err) {
    return res.status(400).send(err.errors[0].message + '!');
  });
}

/**
 * Handles request for admin user sign-up
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{undefined}
 */
function createAdminUser(req, res) {
  // Hash password to save in the database
  var password = _bcrypt2.default.hashSync(req.body.password, 10);
  return User.create({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    password: password,
    membership: 'basic',
    isadmin: true
  }).then(function (user) {
    return res.status(201).send(user);
  }).catch(function (err) {
    return res.status(400).send(err.errors[0].message + '!');
  });
}