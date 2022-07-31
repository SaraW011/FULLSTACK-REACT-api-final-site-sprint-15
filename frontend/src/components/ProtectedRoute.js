// HOC wrapper component
// always returns a Route component
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ 
  loggedIn, 
  redirectPath = "/signup", 
  children 
}) => {
  if (!loggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default ProtectedRoute;
