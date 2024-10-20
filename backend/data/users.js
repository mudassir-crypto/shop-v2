import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('adminuser'),
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: bcrypt.hashSync('johndoe'),
    role: 'user'
  },
  {
    name: 'Jana Doe',
    email: 'jana@gmail.com',
    password: bcrypt.hashSync('janadoe'),
    role: 'user'
  }
]

export default users