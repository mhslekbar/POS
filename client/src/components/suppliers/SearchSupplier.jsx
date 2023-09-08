import React, { useState } from 'react'
import { useDispatch } from "react-redux"
import { getSuppliers } from "../../redux/supplier/supplierApiCalls"

const SearchSupplier = () => {
  const [supplier, setSupplier] = useState("")
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    const name = e.target.value
    setSupplier(e.target.value)
    await dispatch(getSuppliers(`?search=${name}`))
  }
  return (
    <div className='w-full mb-2'>
      <label htmlFor="supplier" className='text-gray-700 font-bold mr-2'>Rechercher</label>
      <input 
        type="text"
        className="shadow border rounded px-3 py-2 focus:outline-none focus:shadow-outline" 
        placeholder="Nom du fournisseur"
        value={supplier}
        onChange={handleSearch}
      />
    </div>
  )
}

export default SearchSupplier
