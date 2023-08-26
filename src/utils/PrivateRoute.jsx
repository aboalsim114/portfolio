import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    setAuth(!!token);
  }, []);

  if (auth === null) {
    return null;
  }

  return auth ? <Outlet /> : <Navigate to="/connexion" />;
};

export default PrivateRoute;