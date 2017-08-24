'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBooks = getBooks;
exports.addBook = addBook;
exports.getUserBooks = getUserBooks;
exports.modifyBook = modifyBook;
exports.borrowBook = borrowBook;
exports.returnBook = returnBook;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Book = _models2.default.Book,
    BorrowDetail = _models2.default.BorrowDetail;

/**
 * Return an array of all books in the database
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{json} all books
 */

function getBooks(req, res) {
  return Book.all().then(function (books) {
    return res.status(200).send(books);
  }).catch(function (err) {
    return res.status(404).send({ message: err.errors[0].message + '!' });
  });
}

/**
 * Add book details specified in request to the database
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{json} added book
 */
function addBook(req, res) {
  return Book.findOne({
    where: {
      title: req.body.title,
      isbn: req.body.isbn
    }
  }).then(function (book) {
    // Update book if book exists
    if (book) {
      book.update({
        count: book.count + 1
      });
      res.status(201).send({
        message: 'Book added to existing library!',
        book: book
      });
    } else {
      // Otherwise create a new book 
      Book.create({
        title: req.body.title,
        isbn: req.body.isbn,
        year: req.body.year,
        author: req.body.author,
        description: req.body.description,
        count: req.body.count
      }).then(function (newBook) {
        return res.status(200).send({
          message: 'Added book successfully',
          book: newBook
        });
      });
    }
  }).catch(function (err) {
    return res.status(400).send({ message: err.errors[0].message + '!' });
  });
}

/**
 * Get the list of a user's borrowed books
 * And depending on the query passed, it may show returned books only
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{json} user borrowed books
 */
function getUserBooks(req, res) {
  if (req.query.returned === 'false') {
    return BorrowDetail.findAll({
      where: {
        userid: req.params.userId,
        returndate: null
      }
    }).then(function (books) {
      return res.status(200).send(books);
    }).catch(function (err) {
      return res.status(400).send({ message: err.errors[0].message + '!' });
    });
  } else if (req.query.returned === 'false') {
    return BorrowDetail.findAll({
      where: {
        userid: req.params.userId,
        $ne: {
          returndate: null
        }
      }
    }).then(function (books) {
      return res.status(200).send(books);
    }).catch(function (err) {
      return res.status(400).send({ message: err.errors[0].message + '!' });
    });
  }
  return res.status(400).send({ message: 'Query missing or wrong: use /path?returned=true' });
}

/**
 * Modify book information already in database
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{string} update status
 */
function modifyBook(req, res) {
  return Book.findOne({
    where: {
      id: req.params.bookId
    }
  }).then(function (book) {
    book.update({
      title: req.body.title || book.title,
      isbn: req.body.isbn || book.isbn,
      year: req.body.year || book.year,
      author: req.body.author || book.author,
      description: req.body.description || book.description,
      count: req.body.count || book.count
    });
    res.status(202).send({
      message: 'Book update successful!',
      book: book
    });
  }).catch(function (err) {
    return res.status(400).send({ message: err.errors[0].message + '!' });
  });

  // return Book
  //   .update({
  //     title: req.body.title || Book.title,
  //     isbn: req.body.isbn || Book.isbn,
  //     year: req.body.year || Book.year,
  //     author: req.body.author || Book.author,
  //     description: req.body.description || Book.description,
  //     count: req.body.count || Book.count,
  //   },
  //   {
  //     where: {
  //       id: req.params.bookId,
  //     },
  //   })
  //   .then(book => res.status(202).send(book[0] === 1 ? { message: 'Book update successful!' } : { message: 'Book update not successful!' }))
  //   .catch(err => res.status(400).send(
  //     { message: `${err.errors[0].message}!` },
  //   ));
}

/**
 * Gives user access to a book if available
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{json} borrowdetail
 */
function borrowBook(req, res) {
  Book.findOne({
    where: {
      title: req.body.booktitle
    }
  }).then(function (book) {
    if (book) {
      book.update({
        count: book.count - 1
      });
    }
  });
  return BorrowDetail.create({
    booktitle: req.body.booktitle,
    borrowdate: Date.now(),
    userid: req.params.userId
  }).then(function (borrowdetail) {
    return res.status(200).send({
      message: 'Book borrowed successfully',
      borrowdetail: borrowdetail
    });
  }).catch(function (err) {
    return res.status(400).send({ message: err.errors[0].message + '!' });
  });
}

/**
 * Marks a book as returned in a user borrow history
 * @param{Object} req - api request
 * @param{Object} res - route response
 * @return{string} borrow status 
 */
function returnBook(req, res) {
  Book.findOne({
    where: {
      title: req.body.booktitle
    }
  }).then(function (book) {
    if (book) {
      book.update({
        count: book.count + 1
      });
    }
  });
  return BorrowDetail.update({
    returndate: Date.now(),
    userid: req.params.userId
  }, {
    where: {
      userid: req.params.userId
    }
  }).then(function (borrowdetail) {
    return res.status(200).send(borrowdetail[0] > 0 ? { message: 'Book returned successfully!' } : { message: 'Book not returned!' });
  }).catch(function (err) {
    return res.status(400).send({ message: err.errors[0].message + '!' });
  });
}