import { LinkContainer } from 'react-router-bootstrap'
import { FaTimes } from 'react-icons/fa'
import { Table, Button } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { useGetAllOrdersQuery } from '../../slices/orderApiSlice'

const OrderListScreen = () => {

  const { data: orders, isLoading, error } = useGetAllOrdersQuery()

  
  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error?.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>{order.totalAmount}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ): (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order?.deliveredAt ? (
                    order.deliveredAt.substring(0, 10)
                  ): (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/order/${order._id}`}>
                    <Button className='btn-sm' variant='light'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen