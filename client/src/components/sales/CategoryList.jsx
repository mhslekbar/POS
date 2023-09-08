import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../redux/product/productApiCalls';
import { ShowSalesContext } from './ShowSales';

const CategoryList = () => {
  const { categories } = useSelector(state => state.categories)
  const { selectedCat, setSelectedCat } = useContext(ShowSalesContext);
  const dispatch = useDispatch();

  const handleChangeCategory = async (cat) => {
    setSelectedCat(cat)
    if(cat.length === 0){
      await dispatch(getProducts("/menuProduct"))
    } else {
      await dispatch(getProducts(`/menuProduct/?catId=${cat._id}`))
    }
  }

  return (
    <div className={`w-full xs:block bg-white px-6 py-3 rounded-full text-gray-700 
    overflow-x-scroll flex flex-nowrap`}>
      <span 
        className={`px-6 py-1 mr-1 rounded-full ${selectedCat === "" && "bg-[#f1f2f6] text-black font-medium"}`}
        onClick={() => handleChangeCategory("")}
      >All</span>
      {categories.map(cat=> (<span 
        className={`px-6 py-1 mr-1 rounded-full ${selectedCat._id === cat._id && "bg-[#f1f2f6] text-black font-medium"}`}
        key={cat._id}
        onClick={() => handleChangeCategory(cat)}
      >
        {cat.name}</span>))}
    </div>
  )
}

export default CategoryList
