import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getSales } from '../../redux/sales/salesApiCalls'

const SearchOrder = () => {
  const [numSale, setNumSale] = useState("")
  const dispatch = useDispatch()

  const handleSearchOrder = async (e) => {
    const order = e.target.value
    setNumSale(e.target.value)
    await dispatch(getSales(`/?numSale=${order}`))    
  }
  return (
    <div className='mb-2'>
        <input 
          type="text" 
          className='w-1/2 shadow rounded px-3 py-2 focus:outline-none focus:shadow-outline'
          placeholder="Rechercher par numero de l'ordre"
          value={numSale}
          onChange={handleSearchOrder}
        />
    </div>
  )
}

export default SearchOrder
