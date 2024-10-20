import express from 'express'
import { body } from 'express-validator'
import { isLoggedIn, customRole } from '../middleware/authMiddleware.js'
import { createOrder, getAllOrders, getMyOrderById, getMyOrders, getOrderById, updateOrderToDelivered, updateOrderToPaid } from '../controllers/orderControllers.js'

const router = express.Router()

router.post('/order/create', isLoggedIn, createOrder)

router.get('/myorders', isLoggedIn, getMyOrders)

router.get('/order/all', isLoggedIn, customRole('admin'), getAllOrders)

router.get('/myorder/:id', isLoggedIn, customRole('user'), getMyOrderById)
router.get('/order/:id', isLoggedIn, customRole('admin'), getOrderById)

router.patch('/order/:id/pay', isLoggedIn, updateOrderToPaid)
router.patch('/order/:id/deliver',isLoggedIn, customRole('admin'), updateOrderToDelivered)

export default router