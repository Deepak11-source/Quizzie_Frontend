import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
const PrivateRoute = () => {
    const isLoggedIn = () => {
        return localStorage.getItem('token') !== null;
    }
    return isLoggedIn() ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
