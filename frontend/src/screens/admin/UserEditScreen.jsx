import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useGetUserByIdQuery, useUpdateUserByIdMutation } from '../../slices/userApiSlice'

const UserEditScreen = () => {

  const { id: userId } = useParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('user')

  const { data: user, isLoading, error } = useGetUserByIdQuery(userId)

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByIdMutation()

  const navigate = useNavigate()

  useEffect(() => {
    if(user){
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
    }
  }, [user])
  
  const submitHandler = async (e) => {
    e.preventDefault()
    const updatedUser = {
      name, email, role
    }
    // console.log(updatedUser)
    try {
      const resp = await updateUser({id: userId, details: updatedUser}).unwrap()
      toast.success(resp.message)
      navigate('/admin/userlist')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }

  }


  return (
    <>
    <Link to='/admin/userlist' className='btn btn-light my-3'>
      Go Back
    </Link>
    <FormContainer>
      <h1>Edit User</h1>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='mrp' className='my-2'>
            <Form.Label>Role</Form.Label>
            <Form.Select aria-label="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-4'>Update</Button>
        </Form>
      )}
      
    </FormContainer>
    </>
  )
}

export default UserEditScreen