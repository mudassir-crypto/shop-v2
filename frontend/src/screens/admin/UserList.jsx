import { LinkContainer } from 'react-router-bootstrap'
import { Button, Table } from 'react-bootstrap'
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/userApiSlice'


const UserList = () => {

  const { data: users, refetch, isLoading, error } = useGetUsersQuery()

  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation()

  const deleteHandler = async (userId) => {
    if(window.confirm('Are you sure?')){
      try {
        const resp = await deleteUser(userId).unwrap()
        toast.success(resp.message)
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <>
    <h1>Users</h1>
    {loadingDelete && <Loader/>}
    {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error?.data?.message || error?.error}</Message>
    ) : (
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            {/* <th>ROLE</th> */}
            <th>ISADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {/* <td>{user.role}</td> */}
              <td>
                {user.role === 'admin' ? (
                  <FaCheck style={{ color: 'green'}} />
                ): (
                  <FaTimes style={{ color: 'red' }} />
                )}
              </td>
              <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                  <Button variant='light' className='btn-sm mx-2'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
              </td>
              <td>
                <Button variant='danger' className='btn-sm mx-2 text-light' onClick={() => deleteHandler(user._id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
    </>
  )
}

export default UserList