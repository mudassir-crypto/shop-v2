import express from 'express'
import { addProductReview, adminGetAllProducts, createProduct, deleteProductById, getAllProducts, getProductById, getTopProducts, updateProduct } from '../controllers/productControllers.js'
import { customRole, isLoggedIn } from '../middleware/authMiddleware.js'
import { body, query } from 'express-validator'

const router = express.Router()

router.get('/products', [
  query('page').trim().escape(),
  query('keyword').trim().escape()
], getAllProducts)

router.get('/products/top', getTopProducts)

router.route('/products/:id')
  .get(getProductById)
  .put(isLoggedIn, customRole('admin'), updateProduct)
  .delete(isLoggedIn, customRole('admin'), deleteProductById)

router.post('/product/create', isLoggedIn, customRole('admin'), createProduct)
router.post('/review/:id', [
  body('rating').isNumeric().withMessage('should be a number between 1-5').trim().escape(),
  body('comment').trim().escape()
],isLoggedIn, addProductReview)

router.get('/admin/products', [
  query('page').trim().escape(),
], isLoggedIn, customRole('admin'), adminGetAllProducts)

export default router
