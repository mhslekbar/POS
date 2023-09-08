import { ExclamationCircleOutline } from 'heroicons-react'
import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-start col-span-9 mx-12 p-6">
      <h1 className="text-4xl">404 Page Not Found </h1>
      <ExclamationCircleOutline className="bg-red-900 text-white rounded w-20 h-20 my-2" /> 
    </div>
  )
}

export default NotFound
