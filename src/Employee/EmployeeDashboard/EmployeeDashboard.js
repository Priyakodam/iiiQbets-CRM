import React, { useState } from 'react';
import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';
import "./EmployeeDashboard.css" ;
import { useAuth } from "../../Context/AuthContext";


const EmployeeDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    
  return (
    <div className='employeedashboard-container'>
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
     <div className={`employeedashboard-content ${collapsed ? 'collapsed' : ''}`}>

      <h2>Welcome, {user.name}</h2>
      </div>
        
        </div>
  )
}

export default EmployeeDashboard