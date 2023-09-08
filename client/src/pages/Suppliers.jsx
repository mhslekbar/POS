import React from 'react'
import ShowSuppliers from '../components/suppliers/ShowSuppliers'
import AddSupplierModal from '../components/suppliers/AddSupplierModal'

const Suppliers = () => {
  return (
    <div className="flex flex-col items-center jusitfy-center w-full col-span-9 mx-12">
      <h1 className="text-4xl my-2 uppercase">Fournisseurs</h1>
      <AddSupplierModal />
      <ShowSuppliers />
    </div>
  )
}

export default Suppliers
