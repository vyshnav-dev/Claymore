import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("SangClaymoreAccessToken");

  return isAuthenticated ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
