import React, { useState } from 'react';
import EmployeeSidebar from './EmployeeSidebar/EmployeeSidebar';




const EmployeeDashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    
  return (
    <div className='employeedashboard-container'>
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
     <div className={`employeedashboard-content ${collapsed ? 'collapsed' : ''}`}>

      EmployeeDashboard
      </div>
        
        </div>
  )
}

export default EmployeeDashboard