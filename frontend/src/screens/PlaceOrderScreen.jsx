import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col, ListGroup, ListGroupItem, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { useCreateOrderMutation } from '../slices/orderApiSlice'
import { clearCart } from '../slices/cartSlice'


const PlaceOrderScreen = () => {

  const cart = useSelector(state => state.cart)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [createOrder, {isLoading, error}] = useCreateOrderMutation()

  

  useEffect(() => {
    if(!cart.shippingAddress.address){
      navigate('/shipping')
    } else if(!cart.paymentMethod){
      navigate('/payment')
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate])
  
  const placeOrderHandler = async () => {
    try {
      const orderItems = cart.cartItems.map((item) => {
        return {_id: item._id, quantity: Number(item.quantity)}
      })
      const order = await createOrder({
        orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod
      }).unwrap()
      dispatch(clearCart())
      // navigate to order
      navigate(`/order/${order._id}`)
    } catch (err) {
      toast.error(err?.data?.message || err?.error)
    }
  }


  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Payment</h2>
            <p>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ListGroup variant='flush'>
                {cart.cartItems.map((item) => (
                  <ListGroupItem key={item._id}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} rounded fluid />
                      </Col>
                      <Col>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.quantity} x ${item.price} = ${item.price * item.quantity}
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h2>Order Summary</h2>
              </ListGroupItem>

              <ListGroupItem>
                <Row>
                  <Col>Items:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>Total:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroupItem>

              {error && (
                <ListGroupItem>
                  <Message variant='danger'>{error?.data?.message || error?.error}</Message>
                </ListGroupItem>
              )}

              <ListGroupItem className='m-auto'>
                <Button type='button' className='btn-block'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroupItem>

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen