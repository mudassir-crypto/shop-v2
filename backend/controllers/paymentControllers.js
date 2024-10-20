import crypto from 'crypto'
import Razorpay from 'razorpay'
import { nanoid } from 'nanoid'
import Order from '../models/order.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { validId } from '../utils/util.js'

export const sendRazorpayKey = asyncHandler(async(req, res) => {
  res.status(200).json({
    razorpayKey: process.env.RAZORPAY_API_KEY
  })
})

export const captureRazorpayPayment = asyncHandler(async(req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }
  const orderById = await Order.findById(req.params.id)

  const instance = new Razorpay({key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_SECRET})

  try {
    const order = await instance.orders.create({
      amount: Number(orderById.totalAmount) * 100,
      currency: "INR",
      receipt: 'receipt_' + nanoid()
    })
    orderById.paymentResult.orderId = order.id
    await orderById.save()
    res.status(200).json(order)
  } catch (error) {
    console.log(error)
    res.status(401)
    throw new Error(`Error 401`)
    // throw new Error(`${error.error.code}: ${error.error.description}`)
  }
})

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const orderById = await Order.findById(req.params.id)
  console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)
  
  const sign = orderById.paymentResult.orderId + '|' + razorpay_payment_id
  console.log('sign: ', sign)
  const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest('hex')

  console.log(razorpay_signature, expectedSign)
  if(razorpay_signature !== expectedSign){
    res.status(400)
    throw new Error('Invalid Payment Signature')
  }
  orderById.paymentResult.paymentId = razorpay_payment_id
  orderById.paymentResult.update_time = Date.now()
  orderById.paymentResult.status = 'verified'
  await orderById.save()

  res.status(200).json({ message: 'Payment verified successfully'})
})