import express from 'express'
import { isLoggedIn } from '../middleware/authMiddleware.js'
import { captureRazorpayPayment, verifyRazorpayPayment, sendRazorpayKey } from '../controllers/paymentControllers.js'

const router = express.Router()

router.route("/razorpaykey")
  .get(isLoggedIn, sendRazorpayKey)

router.post('/create-order/:id', isLoggedIn, captureRazorpayPayment)
router.post('/verify-payment/:id', isLoggedIn, verifyRazorpayPayment)


export default router