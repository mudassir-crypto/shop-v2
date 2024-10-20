import Order from '../models/order.js'
import User from '../models/user.js'
import Product from '../models/product.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { validId, addDecimals } from '../utils/util.js'


export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body

  try {
    if(!orderItems || orderItems.length <= 0){
      res.status(401)
      throw new Error('There is something wrong with the ID')
    }
  
    for(let idx = 0; idx < orderItems.length; idx++){
      if(!(validId(orderItems[idx]._id))){
        res.status(401)
        throw new Error('There is something wrong with the ID')
      }
    }

    let itemsPrice = 0
    // orderItems = { product, quantity }
    for(let idx = 0; idx < orderItems.length; idx++){
      const product = await Product.findById(orderItems[idx]._id)
      if(product.stock - Number(orderItems[idx].quantity) < 0){
        res.status(401)
        throw new Error('Order can\'t be processed')
      }
      product.stock = Number(product.stock - Number(orderItems[idx].quantity))
      await product.save()
      orderItems[idx]['product'] = product._id
      delete orderItems[idx]['_id']
      orderItems[idx]['totalPrice'] = Number(product.price) * Number(orderItems[idx].quantity)
      itemsPrice += orderItems[idx]['totalPrice']
    }
    
    const shippingAmount  = itemsPrice > 1 ? addDecimals(itemsPrice > 100 ? 0 : 10) : addDecimals(0)
    const taxAmount = addDecimals(Number(0.15 * itemsPrice))
    const totalAmount = addDecimals(Number(itemsPrice) + Number(shippingAmount) + Number(taxAmount))

    const order = await Order.create({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      user: req.user._id
    })
    
    res.status(201).json(order)
    
  } catch (error) {
    res.status(401)
    throw new Error('There is something wrong')
  }
})

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.status(200).json(orders)
})

export const getOrderById = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name image price')
  if(order){
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export const getMyOrderById = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const order = await Order.findById(req.params.id).populate('user', '_id name email').populate('orderItems.product', 'name image price')
  if(order && order.user._id.toString() === req.user._id.toString()){
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  // const { id, status, update_time, payer } = req.body

  const order = await Order.findById(req.params.id).populate('user', '_id')
  
  if(order && order.user._id.toString() === req.user._id.toString()){
    order.isPaid = true
    order.paidAt = Date.now()
    // order.paymentResult = {
    //   id, status, update_time, email_address: payer.email_address
    // }
    const updatedOrder = await order.save()
    res.status(200).json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const order = await Order.findById(req.params.id)
  if(order){
    order.deliveredAt = Date.now()
    await order.save()
    res.status(200).json('Order is marked as delivered')
  } else {
    res.status(404)
    throw new Error('ORder not found')
  }
})

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', '_id name')
  res.status(200).json(orders)
})