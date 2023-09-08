import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { getPurchase } from '../../redux/purchases/purchaseApiCalls';

const SeachPurchase = () => {
  const [numPurchase, setNumPurchase] = useState("");
  const dispatch = useDispatch()
  const handleSearch = async (e) => {
    setNumPurchase(e.target.value)
    const num = e.target.value
    await dispatch(getPurchase(`/?numPurchase=${num}`))
  }

  return (
    <div className="my-2">
      <label 
        htmlFor="numPurchase"
        className='font-bold text-gray-700 mr-2'
      >Rechercher</label>
      <input 
        type="text"
        id="numPurchase"
        className="border rounded shadow w-1/4 px-3 py-2 focus:outline-none focus:outline-shadow" 
        placeholder="rechercher par numero"
        onChange={handleSearch}
        value={numPurchase}
      />
    </div>
  )
}

export default SeachPurchase
