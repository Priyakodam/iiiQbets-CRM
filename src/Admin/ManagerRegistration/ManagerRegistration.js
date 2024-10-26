import React,{useState} from 'react';
import "./ManagerRegistration.css";
import EmployeeSidebar from '../../Employee/EmployeeDashboard/EmployeeSidebar/EmployeeSidebar';

const ManagerRegistration = () => {
    const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='managerregistration-container'>
      <EmployeeSidebar onToggleSidebar={setCollapsed} />
     <div className={`managerregistration-content ${collapsed ? 'collapsed' : ''}`}>
        Manager Registration
        </div>
        </div>
  )
}

export default ManagerRegistration