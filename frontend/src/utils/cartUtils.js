const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  // If order is above 100$ then free
  state.shippingPrice = state.itemsPrice > 1 ? addDecimals(state.itemsPrice > 100 ? 0 : 10) : addDecimals(0)

  // tax 18%
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice))

  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  )

  localStorage.setItem('cart', JSON.stringify(state))
}
