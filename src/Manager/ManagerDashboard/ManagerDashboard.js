import React, { useState } from 'react';
import ManagerSidebar from '../ManagerSidebar/ManagerSidebar';
import "./ManagerDashboard.css" ;
import { useAuth } from "../../Context/AuthContext";


const EmployeeDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    
  return (
    <div className='managerdashboard-container'>
      <ManagerSidebar onToggleSidebar={setCollapsed} />
     <div className={`managerdashboard-content ${collapsed ? 'collapsed' : ''}`}>

      <h2>Welcome, {user.name}</h2>
      </div>
        
        </div>
  )
}

export default EmployeeDashboard