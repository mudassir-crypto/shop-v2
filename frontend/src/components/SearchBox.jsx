import { useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'


const SearchBox = () => {
  const { keyword: urlKeyword } = useParams()

  const [keyword, setKeyword] = useState(urlKeyword || '')
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    if(keyword.trim()){
      navigate(`/search/${keyword}`)
      setKeyword('')
    } else {
      navigate('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        placeholder='Search Products...'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className='mt-sm-2 ml-sm-5'
      >
      </Form.Control>
      <Button type='submit' variant='outline-light' className='mx-2 mt-2'>Search</Button>
    </Form>
  )
}

export default SearchBox