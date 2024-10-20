import mongoose from "mongoose"

const {ObjectId} = mongoose.Types

export const validId = (id) => {
  return ObjectId.isValid(id) && (String)(ObjectId.createFromHexString(id)) === id
}

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}