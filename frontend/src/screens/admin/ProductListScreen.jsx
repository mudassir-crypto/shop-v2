import { useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Table, Button, Row, Col } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'
import { useCreateProductMutation, useDeleteProductMutation, useAdminGetProductsQuery } from '../../slices/productApiSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const ProductListScreen = () => {
  const { page } = useParams()

  const { data, refetch, isLoading, error } = useAdminGetProductsQuery({ page })

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation()
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation()

  const navigate = useNavigate()

  const createProductHandler = async () => {
    if(window.confirm('Are you sure you want to create a new product?')){
      try {
        const resp = await createProduct().unwrap()
        refetch()
        // route to edit page
        navigate(`/admin/product/${resp._id}/edit`)
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const deleteHandler = async (productId) => {
    if(window.confirm('Are you sure?')){
      try {
        const resp = await deleteProduct(productId).unwrap()
        toast.success(resp.message)
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? <Loader /> : error ? <Message variant='danger'>{error?.data?.message || error?.error}</Message> : (
        <>
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>STOCK</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, idx) => (
              <tr key={idx}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.stock}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                </td>
                <td>
                  <Button variant='danger' className='btn-sm mx-2 text-light' onClick={() => deleteHandler(product._id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate pages={data.pages} page={data.page} role='admin' />
        </>
      )}
      
    </>
  )
}

export default ProductListScreen