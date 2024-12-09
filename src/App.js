import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./Login/Login";
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
import EmployeeDashboard from "./Employee/EmployeeDashboard/EmployeeDashboard";
import ManagerView from "./Admin/ManagerRegistration/ManagerView";
import EmployeeRegistration from "./Admin/EmployeeRegistration/EmloyeeRegistration";
import AddCustomer from "./Employee/AddCustomer/AddCustomer";
import AddProduct from "./Admin/Products/AddProduct";
import AdminViewViewProduct from "./Admin/Products/AdminViewProducts";
import EmployeeAddLeads from "./Employee/AddLeads/EmployeeAddLeads";
import ManagerDashboard from "./Manager/ManagerDashboard/ManagerDashboard";
import EmployeeAddQuotation from "./Employee/Quotation/EmployeeAddQuotation";
import MyTeam from "./Manager/MyTeam/MyTeam";
import ManagerAddLeads from "./Manager/ManagerLeads/ManagerAddLeads";
import ManagerAddCustomer from "./Manager/ManagerCustomers/ManagerAddCustomer";
import ManagerQuotation from "./Manager/ManagerQuotation/ManagerQuotation" ;

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
            <Route path="/manager-view" element={<ManagerView />} />
            <Route path="/employee-register" element={<EmployeeRegistration />} />
            <Route path="/e-dashboard" element={<EmployeeDashboard />} />
            <Route path="/e-addcustomer" element={<AddCustomer />} />
            <Route path="/a-addproduct" element={<AddProduct />} />
            <Route path="/a-viewproduct" element={<AdminViewViewProduct />} />
            <Route path="/e-addleads" element={<EmployeeAddLeads />} />
            <Route path="/m-dashboard" element={<ManagerDashboard />} />
            <Route path="/e-addquotation" element={<EmployeeAddQuotation />} />
            <Route path="/m-team" element={<MyTeam />} />
            <Route path="/m-addcustomers" element={<ManagerAddCustomer />} />
            <Route path="/m-addleads" element={<ManagerAddLeads />} />
            <Route path="/m-quotation" element={<ManagerQuotation />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
