import React from 'react'
import ShowSales from '../components/sales/ShowSales'

const Sales = () => {

  return <div className="flex flex-col items-center w-full md:col-span-9 mx-12">
    <h1 className="text-4xl my-2 uppercase">Orders</h1>
    <ShowSales />
  </div>
}

export default Sales
