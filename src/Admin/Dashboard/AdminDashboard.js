import React, { useState } from 'react';
import Dashboard from './Dashboard';
import "./AdminDashboard.css";


const AdminDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    
  return (
    <div className='admindashboard-container'>
      <Dashboard onToggleSidebar={setCollapsed} />
     <div className={`admindashboard-content ${collapsed ? 'collapsed' : ''}`}>

      AdminDashboard
      </div>
        
        </div>
  )
}

export default AdminDashboard
