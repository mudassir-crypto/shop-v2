import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { useRegisterMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'


const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()
  const { userInfo } = useSelector(state => state.auth)

  const { search } = useLocation()
  const searchParam = new URLSearchParams(search)
  const redirect = searchParam.get('redirect') || '/'


  const submitHandler = async(e) => {
    e.preventDefault()
    if(password !== confirmPassword){
      toast.error('Passwords do not match')
      return
    }
    try {
      const resp = await register({name, email, password}).unwrap()
      dispatch(setCredentials({...resp}))
    } catch (err) {
      toast.error(err?.data?.message || err?.error)
    }
  }

  useEffect(() => {
    if(userInfo){
      navigate(`/${redirect}`)
    }
  }, [userInfo, redirect, navigate])
  

  return (
    <FormContainer>
      <h1>Sign Up</h1>

      <Form onSubmit={submitHandler}>
      <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name: </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email: </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='off'
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password: </Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete='off'
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-3'
          disabled={isLoading}
        >Sign Up</Button>

        {isLoading && <Loader />}
      </Form>

      <Row>
        <Col>
          Already a Customer? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen