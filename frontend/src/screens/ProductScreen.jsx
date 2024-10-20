import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ListGroup,
  Card,
  Row,
  Col,
  Image,
  Button,
  ListGroupItem,
  Form
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import { useGetProductByIdQuery, useAddReviewMutation } from '../slices/productApiSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'
import Meta from '../components/Meta'

const ProductScreen = () => {
  const { id: productId } = useParams()
  const [rating, setRating] = useState(5)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [quantity, setQuantity] = useState(1)
  const [comment, setComment] = useState('')
 
  const { data: product, refetch ,isLoading, error } = useGetProductByIdQuery(productId)
  const [addReview, {isLoading: loadingReview}] = useAddReviewMutation()

  const { userInfo } = useSelector(state => state.auth)

  function percDiff(a, b) {
    return Math.trunc((100 * Math.abs(a - b)) / ((a + b) / 2))
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const addToCartHandler = async() => {
    dispatch(addToCart({ ...product, quantity }))
    navigate('/cart')
  }

  const submitHandler = async(e) => {
    e.preventDefault()
    try {
      const resp = await addReview({ productId, data: { rating, comment }}).unwrap()
      refetch()
      toast.success(resp.message)
      setRating(5)
      setComment('')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
    <Link to='/' className='btn btn-light my-3'>
      Go Back
    </Link>

    {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error?.data?.message || error?.error}</Message>
    ) : (
      <>
        <Meta title={product.name} />
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>

          <Col md={4}>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <h3>{product.name}</h3>
              </ListGroupItem>
              <ListGroupItem>
                <Rating
                  value={product.rating}
                  text={`${product.numOfReviews} reviews`}
                />
              </ListGroupItem>
              <ListGroupItem>
                Price: ${product.price} <s>${product.mrp}</s>
              </ListGroupItem>
              <ListGroupItem>Description: {product.description}</ListGroupItem>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroupItem>
                  <Row>
                    <Col>Price: </Col>
                    <Col>
                      <strong>${product.price}</strong>
                      <b className='text-success'>
                        &nbsp;
                        {percDiff(product.price, product.mrp)}% off
                      </b>
                      <p><s>${product.mrp}</s></p>
                    </Col>
                  </Row>
                </ListGroupItem>

                <ListGroupItem>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      <strong>
                        {product.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </strong>
                    </Col>
                  </Row>
                </ListGroupItem>

                {product.stock > 0 && (
                  <ListGroupItem>
                    <Row>
                      <Col>Quantity</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                          {[...Array(product.stock).keys()].map((x) => (
                            <option key={x} value={x+1}>{x + 1}</option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}

                <ListGroupItem className='m-auto'>
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={product.stock === 0}
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row className='review'>
          <Col md={6}>
            <h2>Reviews</h2>
            {product.reviews.length === 0 && <Message>No Reviews</Message>}
            <ListGroup variant='flush'>
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.user.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>Write a Customer Review</h2>

                {loadingReview && <Loader />}

                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId='rating' className='my-2'>
                      <Form.Label>Rating</Form.Label>
                      <Form.Select aria-label="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        <option value="">Select..</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group controlId='comment' className='my-2'>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows={3}
                        value={comment} onChange={(e) => setComment(e.target.value)}
                      >
                      </Form.Control>
                    </Form.Group>
                    <Button
                      type='submit'
                      variant='primary'
                      disabled={loadingReview}
                    >
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    Please <Link to='/login'>Login</Link> to write a review 
                  </Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </>
    )}
    </>
  )
}

export default ProductScreen
