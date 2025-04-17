// src/App.tsx
import React, { JSX } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Temporarily show Dashboard without authentication for testing */}
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/dashboard-protected"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
