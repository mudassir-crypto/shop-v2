export const notFound = (req, res, next) => {
  console.log('not found executed')
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}


export const errorHandler = (err, req, res, next) => {
  console.log('error handler executed')
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}