import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getClients } from '../../redux/client/clientApiCalls';

const SearchClient = () => {
  const [client, setClient] = useState("")
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    const name = e.target.value
    setClient(e.target.value)
    await dispatch(getClients(`?search=${name}`))
  }
  return (
    <div className='w-full mb-2'>
      <label htmlFor="client" className='text-gray-700 font-bold mr-2'>Rechercher</label>
      <input 
        type="text"
        className="shadow border rounded px-3 py-2 focus:outline-none focus:shadow-outline" 
        placeholder="Nom ou telephone"
        value={client}
        onChange={handleSearch}
      />
    </div>
  )
}

export default SearchClient
