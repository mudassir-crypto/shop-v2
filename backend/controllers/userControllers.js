import { validationResult } from 'express-validator'
import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/user.js'
import generateToken from '../utils/generateToken.js'
import { validId } from '../utils/util.js'


export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].path} ${errors.array()[0].msg}`)
  }

  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if(existingUser){
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({ name, email, password })
  if(user){
    generateToken(res, user._id)
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }

})

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].path} ${errors.array()[0].msg}`)
  }

  const { email, password } = req.body
  const user = await User.findOne({ email })

  if(user && (await user.matchPassword(password))){
    generateToken(res, user._id)

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

export const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  res.status(200).json({ message: 'Logged out successfully' })
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
})

export const getUserProfile = asyncHandler(async (req, res) => {
  const { _id, name, email, role } = req.user
  res.status(200).json({
    id: _id, name, email, role
  })
})

export const updateUserProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(401)
    throw new Error(`${errors.array()[0].path} ${errors.array()[0].msg}`)
  }

  const user = await User.findById(req.user._id)

  if(user){
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
  
    if(user.email !== req.user.email){
      const existingUser = await User.findOne({email: user.email})
      if(existingUser){
        res.status(401)
        throw new Error('Email already exists, try a different one')
      }
    }

    if(req.body.password){
      user.password = req.body.password
    }
    
    const updatedUser = await user.save()

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    })
  } else {
    res.status(401)
    throw new Error('User not found')
  }
  
})

export const getUserById = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const user = await User.findById(req.params.id).select('-password')
  if(user){
    res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export const updateUserById = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const user = await User.findById(req.params.id)
  if(user){
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.role = req.body.role || user.role

    await user.save()
    res.status(200).json({ message: 'User updated'})
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export const deleteUserById = asyncHandler(async (req, res) => {
  if(!(validId(req.params.id))){
    res.status(401)
    throw new Error('Invalid parameter')
  }

  const user = await User.findById(req.params.id)
  if(user){
    if(user.role === 'admin'){
      res.status(400)
      throw new Error('Cannot delete admin user')
    }
    await User.deleteOne({ _id: user._id })
    res.status(200).json({ message: 'User removed'})
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})