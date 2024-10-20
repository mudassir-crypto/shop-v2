import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Form, Button, Card } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../slices/cartSlice'


const CartScreen = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { cartItems } = useSelector((state) => state.cart)

  const addToCartHandler = async (product, quantity) => {
    dispatch(addToCart({...product, quantity}))
  }
  const removeFromCartHandler = async (productId) => {
    dispatch(removeFromCart(productId))
  }
  const checkoutHandler = () => {
    navigate('/login?redirect=shipping')
  }

  
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant='primary'>
            Your cart is empty <Link to='/' style={{textDecoration: 'underline'}}>Go Back</Link>
          </Message>
        ) : (
          <ListGroup>
            {cartItems.map((product) => (
              <ListGroup.Item key={product._id}>
                <Row>
                  <Col md={2}>
                    <Image src={product.image} alt={product.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </Col>
                  <Col md={2}>${product.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={product.quantity}
                      onChange={(e) => addToCartHandler(product, Number(e.target.value))}
                    >
                      {[...Array(product.stock).keys()].map((x) => (
                        <option key={x} value={x+1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(product._id)}> 
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Total ({cartItems.reduce((acc, item) => item.quantity + acc, 0)}) items</h2>
              ${cartItems.reduce((acc, item) => item.quantity * item.price + acc, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              > Proceed To Checkout</Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen