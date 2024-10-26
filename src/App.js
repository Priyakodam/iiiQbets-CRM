import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./Login/Login";
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
import EmployeeDashboard from "./Employee/EmployeeDashboard/EmployeeDashboard";
import ManagerRegistration from "./Admin/ManagerRegistration/ManagerRegistration";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/e-dashboard" element={<EmployeeDashboard />} />
            <Route path="/manager-registration" element={<ManagerRegistration />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
