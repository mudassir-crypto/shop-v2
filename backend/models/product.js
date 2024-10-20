import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
    },
    mrp: {
      type: Number,
      required: [true, 'mrp is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    category: {
      type: String,
      required: [
        true,
        'Select a category',
      ],
    },
    brand: {
      type: String,
      required: [true, 'brand name is required'],
    },
    stock: {
      type: Number,
      required: [true, 'stock is required'],
    },
    image: {
      type: String
    },
    rating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)
