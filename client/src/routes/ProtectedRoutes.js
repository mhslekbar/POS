import React from 'react'
import { useSelector } from 'react-redux'
import {  Navigate, Outlet } from 'react-router'

const ProtectedRoutes = () => {
  const { userData } = useSelector(state => state.login)
  
  return (
    userData ? <Outlet /> : <Navigate to="/login"/>
  )
}

export default ProtectedRoutes
