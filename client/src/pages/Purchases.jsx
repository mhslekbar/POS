import React from 'react'
import ShowPurchases from '../components/purchases/ShowPurchases';

const Purchases = () => {
  return <div className="flex flex-col items-center w-full col-span-9 mx-12">
    <h1 className="text-4xl my-2 uppercase">Achats</h1>
    <ShowPurchases />
  </div>
}

export default Purchases;
