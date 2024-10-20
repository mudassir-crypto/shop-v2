import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true
      },
      totalPrice: {
        type: Number,
        required: true
      }
    }
  ],
  shippingAddress: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentResult: {
    orderId: { type: String},
    paymentId: { type: String },
    status: { type: String },
    update_time: { type: Date },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxAmount: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingAmount: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  orderStatus: {
    type: String,
    default: 'processing'
  },
  deliveredAt: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)