import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import Message from "../components/Message"
import Loader from "../components/Loader"
import { useGetMyOrderByIdQuery, usePayOrderMutation, useGetRazorpayKeyQuery, useCreateRazorpayOrderMutation, useVerifyRazorpayOrderMutation } from "../slices/orderApiSlice"
import { useRazorpay } from "react-razorpay"

const OrderScreen = () => {
  const { id: orderId } = useParams()

  const { data: order, refetch, isLoading, error } = useGetMyOrderByIdQuery(orderId)
  const {data: dataRazorPay, isLoading: loadingRazorpay, errorRazorpay} = useGetRazorpayKeyQuery()
  
  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation(orderId, {})

  const [createRpOrder, { isLoading: loadingRpOrder, error: errorRpOrder }] = useCreateRazorpayOrderMutation()
  const [verifyRpOrder] = useVerifyRazorpayOrderMutation()

  const { userInfo } = useSelector(state => state.auth)

  const { Razorpay }= useRazorpay()
  

  // useEffect(() => {
    
  // }, [order])

  const onApproveTest = async () => {
    await payOrder(orderId)
    refetch()
    toast.success('Payment successfull')
  }

  const handlePayment = async () => {
    try {
      const resp = await createRpOrder(orderId).unwrap()
  
      const options = {
        key: dataRazorPay.razorpayKey,
        amount: resp.amount,
        currency: resp.currency,
        name: "Rumi", // Add company details
        description: "Payment for your order", // Add order details
        order_id: resp.id,
        // this is make function which will verify the payment
        // after making the payment 
        handler: async (response) => {
          try {
            verifyRpOrder({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap()
            await payOrder(orderId).unwrap()
            // Add onPaymentSuccessfull function here
            toast.success("Payment successful!");
            refetch()
          } catch (err) {
            // Add onPaymentUnSuccessfull function here
            toast.error("Payment failed: " + err.message);
          }
        },
        prefill: {
          name: "John Doe", // add customer details
          email: "john@example.com", // add customer details
          contact: "9999999999", // add customer details
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      }
      const rzpay = new Razorpay(options);
      rzpay.open(options)
    } catch (error) {
      console.log(error)
      toast.error('Error in making the payments')
    }
  }

  // const onApprove = (data, actions) => { 
  //   return actions.order.capture().then(async function(details){
  //     try {
  //       await payOrder({orderId, details})
  //       refetch()
  //       toast.success('Payment successfull')
  //     } catch (err) {
  //       toast.error(err?.data?.message || err?.message)
  //     }
  //   })
  // }

  // const createOrder = (data, actions) => {
  //   return actions.order.create({
  //     // intent: 'CAPTURE',
  //     purchase_units: [
  //       {
  //         amount: { 
  //           currency_code: 'USD',
  //           value: order.totalAmount 
  //         }
  //       }
  //     ]
  //   }).then((orderID) => {
  //     return orderID
  //   })
  // }
  
  // const onError = (err) => {
  //   toast.error(err.message)
  // }

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

                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {isLoading ? <Loader /> : (
                      <div>
                        <Button onClick={onApproveTest} style={{marginBottom: '10px'}}>Test Pay Order</Button>
                        <div>
                          {/* <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons> */}
                          <button onClick={handlePayment}>Pay with Razorpay</button>
                        </div>
                      </div>
                    )}
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

export default OrderScreen