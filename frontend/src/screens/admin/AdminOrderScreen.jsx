import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import {  useGetOrderByIdQuery, useUpdateOrderToDeliveredMutation } from "../../slices/orderApiSlice"
import { toast } from "react-toastify"


const AdminOrderScreen = () => {
  const { id: orderId } = useParams()

  const { data: order, refetch, isLoading, error } = useGetOrderByIdQuery(orderId)

  const [deliverOrder, {isLoading: loadingDeliver, }] = useUpdateOrderToDeliveredMutation(orderId)

  const { userInfo } = useSelector(state => state.auth)

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId)
      refetch()
      toast.success('Order is marked as delivered')
    } catch (err) {
      toast.error(err?.data?.message || err.message)
    }
  }

  return (
    <>
      {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error?.data?.message || error?.error}</Message>
    ) : (
      <>
        <h2>Order {order._id}</h2>
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong>
                  {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  {order.user.email}
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
                {order?.deliveredAt ? (
                  <Message variant='success'>
                    Delivered on {order.deliveredAt} 
                  </Message>
                ) :(
                  <Message variant='danger'>Not delivered</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant='success'>
                    Paid on {order.paidAt} 
                  </Message>
                ) :(
                  <Message variant='danger'>Not Paid</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item variant='flush'>
                <h2>Order Items</h2>
                {order.orderItems.map((item, idx) => (
                  <ListGroup.Item key={idx}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.product.image} alt={item.product.name} rounded fluid />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.quantity} x ${item.product.price} = ${item.totalPrice}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingAmount}</Col>
                  </Row>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxAmount}</Col>
                  </Row>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalAmount}</Col>
                  </Row>
                </ListGroup.Item>

                {loadingDeliver && <Loader />}

                {userInfo && userInfo.role === 'admin' && order.isPaid && !order.deliveredAt && (
                  <ListGroup.Item>
                    <Button type='button' className="btn btn-block" onClick={deliverOrderHandler}>
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}

              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    )}
    </>
  )
}

export default AdminOrderScreen