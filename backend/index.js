import app from './app.js'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

dotenv.config()
connectDB()
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT} in ${process.env.NODE_ENV} mode`)
})