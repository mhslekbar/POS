import React from 'react'
import ShowProducts from '../components/products/ShowProducts'

const Products = () => {
  return (
    <div className="flex flex-col items-center jusitfy-center w-full col-span-9 mx-12">
      <h1 className="text-4xl my-2 uppercase">Produits</h1>
      <ShowProducts />
    </div>
  )
}

export default Products
