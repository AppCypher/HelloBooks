import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models';

const { User } = db;

/**
 * Handles request for user sign-up
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{json} registered user details
 */
export function createUser(req, res) {
  // Hash password to save in the database
  const password = bcrypt.hashSync(req.body.password, 10);
  return User
    .create({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password,
      membership: 'basic',
    })
    .then(user => res.status(201).send(
      user,
    ))
    .catch(err => res.status(400).send(
      { message: `${err.errors[0].message}!` },
    ));
}

/**
 * Handles request for sign-in with basic authentication
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{string} log-in status 
 */
export function loginUser(req, res) {
  return User
    .findOne({
      where: { username: req.body.username },
    })
    .then((user) => {
      // Create a session token with 10-minute session
      const token = jwt.sign({ username: user.username, isadmin: user.isadmin }, process.env.SECRET_KEY, { expiresIn: '10m' });
      bcrypt.compare(req.body.password, user.password).then((check) => {
        if (check) {
          res.status(200).send({
            message: 'Successfully Logged in!',
            token,
          });
        }
        res.status(401).send({ message: 'Wrong password or username!' });
      });
    })
    .catch(err => res.status(400).send(
      { message: `${err.errors[0].message}!` },
    ));
}

/**
 * Handles request for admin user sign-up
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{json} registered admin user details
 */
export function createAdminUser(req, res) {
  // Hash password to save in the database
  const password = bcrypt.hashSync(req.body.password, 10);
  return User
    .create({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password,
      membership: 'basic',
      isadmin: true,
    })
    .then(user => res.status(201).send(
      user,
    ))
    .catch(err => res.status(400).send(
      { message: `${err.errors[0].message}!` },
    ));
}
