import db from '../models';

const { Book, User, BorrowDetail } = db;

/**
 * Check if book exists
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
export function checkBookExists(req, res, next) {
  Book
    .findOne({
      where: {
        id: req.params.bookId,
      },
    })
    .then((book) => {
      if (!book) {
        res.status(404).send({ message: "Can't find book!" });
      }
      next();
    });
}

/**
 * Check if a user borrowed a particular book
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
export function checkUserExists(req, res, next) {
  User
    .findOne({
      where: {
        id: req.params.userId,
      },
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User does not exist!' });
      } else next();
    });
}


/**
 * Check if a user borrowed a particular book
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
export function checkUserNameExists(req, res, next) {
  User
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User does not exist!' });
      } else next();
    });
}

/**
 * Check if a user borrowed a particular book
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
export function checkUserBorrowedBook(req, res, next) {
  BorrowDetail
    .findOne({
      where: {
        booktitle: req.body.booktitle,
        userid: req.params.userId,
      },
    })
    .then((borrowdetail) => {
      if (borrowdetail) {
        res.status(409).send({ message: 'User already borrowed book!' });
      } else next();
    });
}

/**
 * Check if a book count is above 0
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
export function checkBookCount(req, res, next) {
  Book
    .findOne({
      where: {
        title: req.body.booktitle,
        count: {
          $gt: 0,
        },
      },
    })
    .then((book) => {
      if (!book) {
        res.status(400).send({ message: 'Out of requested book!' });
      } else next();
    });
}

/**
 * Check if a user returned a particular book
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @param{Object} next - jumping to next handler
 * @return{undefined}
 */
export function checkUserReturnedBook(req, res, next) {
  BorrowDetail
    .findOne({
      where: {
        id: req.params.userId,
      },
    })
    .then((borrowdetail) => {
      if (!borrowdetail && borrowdetail.returndate === null) {
        res.status(400).send({ message: 'Book already returned!' });
      } else next();
    });
}
