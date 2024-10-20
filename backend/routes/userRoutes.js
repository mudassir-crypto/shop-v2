import express from 'express'
import { deleteUserById, getAllUsers, getUserById, getUserProfile, login, logout, registerUser, updateUserById, updateUserProfile } from '../controllers/userControllers.js'
import { body } from 'express-validator'
import { isLoggedIn, customRole } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', [
  body('name', 'should be atleast 4 char long').isLength({ min: 4 }).trim().escape(),
  body('email').isEmail().trim().escape(),
  body('password', 'should be atleast 6 chars long').isLength({ min: 6 }).trim().escape()
], registerUser)
router.post('/login', [
  body('email').isEmail().trim().escape(),
  body('password', 'should be atleast 6 chars long').isLength({ min: 6 }).trim().escape()
], login)

router.post('/logout', logout)

router.get('/users', isLoggedIn, customRole('admin'), getAllUsers)

router.route('/user/profile')
  .get(isLoggedIn, getUserProfile)
  .put(isLoggedIn, [
    body('name', 'should be atleast 4 char long').isLength({ min: 4 }).trim().escape(),
    body('email').isEmail().trim().escape(),
    body('password', 'should be atleast 6 chars long').optional().isLength({ min: 6 }).trim().escape()
  ], updateUserProfile)

router.route('/user/:id')
  .get(isLoggedIn, customRole('admin'), getUserById)
  .put(isLoggedIn, customRole('admin'), updateUserById)
  .delete(isLoggedIn, customRole('admin'), deleteUserById)

export default router