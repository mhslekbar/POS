import React from 'react'
import ShowCategories from '../components/categories/ShowCategories'

const Categories = () => {
  return <div className="flex flex-col items-center w-full col-span-9 mx-12">
    <h1 className="text-4xl my-2 uppercase my-4">Categories</h1>
    <ShowCategories /> 
    {/* text-gray-700 font-bold  */}
  </div>
}

export default Categories
