import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getProducts } from '../../redux/product/productApiCalls'
import { ShowSalesContext } from './ShowSales'

const SearchProducts = () => {
  const [productName, setProductName] = useState("")
  const { selectedCat } = useContext(ShowSalesContext);

  const dispatch = useDispatch()

  const handleSearchProduct = async (e) => {
    const title = e.target.value
    setProductName(e.target.value)
    if(selectedCat) {
      await dispatch(getProducts(`/menuProduct/?title=${title}&catId=${selectedCat._id}`))
    } else {
      await dispatch(getProducts(`/menuProduct/?title=${title}`))
    }
  }

  return (
    <div className='mb-2'>
      <input 
        type="text"
        className='w-1/2 px-3 py-2 rounded border shadow focus:outline-none focus:outline-shadow'
        placeholder='Rechercher par titre du produit'
        value={productName}
        onChange={handleSearchProduct}
      />
    </div>
  )
}

export default SearchProducts
