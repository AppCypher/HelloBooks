import express from 'express';
import { createUser, loginUser, createAdminUser } from '../controllers/user';
import { getBooks, addBook, getUserBooks, modifyBook, borrowBook, returnBook } from '../controllers/book';
import { checkBookExists, checkUserExists, checkUserNameExists, checkUserReturnedBook, checkBookCount, checkUserBorrowedBook } from '../middleware/validate';
import { verifyUserSession, verifyAdminStatus } from '../middleware/authorize';

const router = express.Router();

// Homepage route is also a signup route
router
  .route('/')
  .get((req, res) => {
    res.status(200).send('Welcome to HelloBooks!');
  });

// Handle request for signing up on the platform 
router
  .route('/api/v1/users/signup')
  .post(createUser);

// Handle request for logging in to the application
router
  .route('/api/v1/users/signin')
  .post(checkUserNameExists, loginUser);

// Handle admin request for adding a new book to the database
router
  .route('/api/v1/books')
  .post(verifyUserSession, verifyAdminStatus, addBook);

// Handle admin request for modifying a book in the db
router
  .route('/api/v1/books/:bookId')
  .put(verifyUserSession, verifyAdminStatus, checkBookExists, modifyBook);

// Handle request for getting all books in the database
router
  .route('/api/v1/books')
  .get(verifyUserSession, getBooks);

// Handle request for getting a user's borrow history
// Must contain query string in the form ?returned=false
router
  .route('/api/v1/users/:userId/books')
  .get(verifyUserSession, checkUserExists, getUserBooks);

// Handle request for allowing a user to borrow a book (admin)
router
  .route('/api/v1/users/:userId/books')
  .post(verifyUserSession, 
    checkUserExists, checkBookCount, checkUserBorrowedBook, borrowBook);

// Handle request for allowing user to return a book (admin)
router
  .route('/api/v1/users/:userId/books')
  .put(verifyUserSession, verifyAdminStatus, checkUserExists, checkUserReturnedBook, returnBook);

// Secret route for admin user login
router
  .route('/api/v1/users/OX8b79Ie89Fd6sh5ysg1JR93d8tR5E892j7Yi0/signup')
  .post(createAdminUser);

export default router;
