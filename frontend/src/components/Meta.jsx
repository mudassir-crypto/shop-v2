import React from 'react'
import { Helmet } from 'react-helmet-async'

const Meta = ({ title = 'Welcome to Shop', description = 'We sell best products for cheap prices', keywords = 'electronics, buy electronic, cheap electronics' }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

export default Meta