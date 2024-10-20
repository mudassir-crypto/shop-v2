import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/api/v1', (req, res) => {
  res.send('API is working')
})

app.use('/api/v1', productRoutes)
app.use('/api/v1', userRoutes)
app.use('/api/v1', orderRoutes)
app.use('/api/v1/upload', uploadRoutes)
app.use('/api/v1/payment', paymentRoutes)

app.get('/api/v1/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))


const __dirname__ = path.resolve()
app.use('/uploads', express.static(path.join(__dirname__, '/uploads')))


app.use(notFound)
app.use(errorHandler)

export default app