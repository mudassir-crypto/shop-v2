import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useUpdateProductMutation, useGetProductByIdQuery,useUploadProductImageMutation } from '../../slices/productApiSlice'

const ProductEditScreen = () => {

  const { id: productId } = useParams()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [mrp, setMrp] = useState(0)
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState(0)
  const [image, setImage] = useState('')

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId)

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if(product){
      setName(product.name)
      setPrice(product.price)
      setMrp(product.mrp)
      setCategory(product.category)
      setBrand(product.brand)
      setDescription(product.description)
      setStock(product.stock)
      setImage(product.image)
    }
  }, [product])
  
  const submitHandler = async (e) => {
    e.preventDefault()
    const updatedProduct = {
      name, price: Number(price), mrp: Number(mrp), category, brand, stock: Number(stock), description, image
    }

    try {
      const resp = await updateProduct({id: productId, updatedProduct}).unwrap()
      toast.success(resp.message)
      navigate('/admin/productlist')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }

  }

  const uploadImageHandler = async (e) => {
    const formData = new FormData()
    formData.append('image', e.target.files[0])

    try {
      const resp = await uploadProductImage(formData).unwrap()
      toast.success(resp.message)
      setImage(resp.image)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }


  return (
    <>
    <Link to='/admin/productlist' className='btn btn-light my-3'>
      Go Back
    </Link>
    <FormContainer>
      <h1>Edit Product</h1>
      {isUpdating && <Loader />}

      {isLoading ? <Loader /> : error ? (
        <Message variant='danger'>{error?.data?.message || error?.error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Product Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='price' className='my-2'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Product Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='mrp' className='my-2'>
            <Form.Label>Mrp</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Product Mrp'
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='image' className='my-2'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Image URL'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control type='file' label='Choose file' onChange={uploadImageHandler}></Form.Control>
          </Form.Group>
          {loadingUpload && <Loader />}

          <Form.Group controlId='brand' className='my-2'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Product Name'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='stock' className='my-2'>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Product Stock'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='category' className='my-2'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Product Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Product Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-4'>Update</Button>
        </Form>
      )}
      
    </FormContainer>
    </>
  )
}

export default ProductEditScreen