import Product from '../models/product.js'
import asyncHandler from '../middleware/asyncHandler.js'
import { validId } from '../utils/util.js'
import { validationResult } from 'express-validator'


export const getAllProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword ? { name: {$regex: req.query.keyword, $options: 'i'} } : {}
  const pageSize = 8

  const count = await Product.countDocuments({...keyword})
  const pages = Math.ceil(count / pageSize)

  let pageQuery = Number(req.query.page)

  if(isNaN(pageQuery) || pageQuery > pages || pageQuery < 1){
    pageQuery = 1
  }

  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (pageQuery-1))
  res.status(200).json({products, page: pageQuery, pages})
})

export const getProductById = asyncHandler(async (req, res) => {

  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const product = await Product.findById(req.params.id).populate('reviews.user', 'name')

  if(product){
    res.status(200).json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    mrp: 0,
    category: 'Sample Category',
    brand: 'Sample Brand',
    description: 'Sample Description',
    stock: 0,
    image: '/images/sample.jpg',
    rating: 0,
    numOfReviews: 0,
    user: req.user._id
  })
  const createdProduct = await product.save()
  res.status(201).json({ _id: createdProduct._id })
})

export const updateProduct = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const { name, price, mrp, category, brand, description, stock, image } = req.body

  const product = await Product.findById(req.params.id)
  if(product){
    product.name = name
    product.price = price
    product.mrp = mrp
    product.category = category
    product.brand = brand
    product.description = description
    product.stock = stock
    product.image = image

    await product.save()
    // const updatedProduct = await product.save()
    // res.status(200).json(updatedProduct)
    res.status(200).json({ message: 'Product updated successfully'})
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

export const deleteProductById = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }
  const product = await Product.findById(req.params.id)

  if(product){
    await Product.deleteOne({ _id: product._id})
    res.status(200).json({ message: 'Product removed'})
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

export const addProductReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].path} ${errors.array()[0].msg}`)
  }

  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)

  if(product){
    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString())
    if(alreadyReviewed){
      res.status(400)
      throw new Error('Product already reviewed')
    }
    const review = {
      rating, comment, user: req.user._id
    }
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length

    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    await product.save()
    res.status(201).json({ message: 'Review added'})
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 10

  const count = await Product.countDocuments()
  const pages = Math.ceil(count / pageSize)

  let pageQuery = Number(req.query.page)

  if(isNaN(pageQuery) || pageQuery > pages || pageQuery < 1){
    pageQuery = 1
  }

  const products = await Product.find().limit(pageSize).skip(pageSize * (pageQuery-1))
  res.status(200).json({products, page: pageQuery, pages})
})

export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1}).limit(3)
  res.status(200).json(products)
})