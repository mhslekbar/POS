import React from 'react'
import ShowClients from '../components/clients/ShowClients'

const Clients = () => {
  return <div className="flex flex-col items-center w-full col-span-9 mx-12">
    <h1 className="text-4xl my-2 uppercase">Clients</h1>
    <ShowClients />
  </div>
}

export default Clients
