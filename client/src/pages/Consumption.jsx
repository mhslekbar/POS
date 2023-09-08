import React from 'react'
import ShowConsumptions from '../components/consumptions/ShowConsumptions'

const Consumption = () => {
  return <div className="flex flex-col items-center w-full col-span-9 mx-12">
    <h1 className="text-4xl my-2 uppercase my-4">Consommations</h1>
    <ShowConsumptions />
  </div>
}

export default Consumption
