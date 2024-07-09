import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user);
    // console.log("private user ", currentUser)
  return currentUser ? <Outlet/> : <Navigate to ='/signin'/>
}
