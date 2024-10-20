import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import asyncHandler from './asyncHandler.js'

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const { id } = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(id).select('-__v -password')
    // console.log(req.user)
    next()
  } catch (error) {
    res.status(401)
    throw new Error('You are not authenticated')
  }

})

export const customRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if(!roles.includes(req.user.role)){
      res.status(401)
      throw new Error('You are not allowed to access this resource')
    }
    next()
  })
}