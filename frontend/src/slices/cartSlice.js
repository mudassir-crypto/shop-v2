import { createSlice } from '@reduxjs/toolkit'
import { updateCart } from '../utils/cartUtils'

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.cartItems.find((x) => x._id === item._id)

      if(existingItem){
        state.cartItems = state.cartItems.map((x) => x._id === existingItem._id ? item : x)
      } else {
        state.cartItems = [ ...state.cartItems, item]
      }
      
      updateCart(state)
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)
      updateCart(state)
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
      updateCart(state)
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
      updateCart(state)
    },

    clearCart: (state, action) => {
      state.cartItems = []
      updateCart(state)
    },

    resetCart: (state, action) => {
      return initialState
    }
  }
})

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart, resetCart } = cartSlice.actions

export default cartSlice.reducer