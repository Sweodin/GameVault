// src/components/PrivateRoute.tsx
import React, { JSX, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({
  children,
}: PrivateRouteProps): JSX.Element {
  const { currentUser } = useAuth();

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}
