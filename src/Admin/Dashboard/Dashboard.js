import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserTie,
  FaUserPlus, 
  FaAddressBook,
} from "react-icons/fa"; 
import { IoHomeOutline } from "react-icons/io5";
import "./Dashboard.css";
import Header from "./Header";
import { useAuth } from "../../Context/AuthContext";
import Logout from "./Logout";
import logo from "../../Img/logocrm.png";


const AdminDashboard = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onToggleSidebar(!collapsed); 
  };

  const handleNavItemClick = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
          <div
            className={`sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
            onClick={toggleSidebar}
          >
            <IoHomeOutline className="toggle-icon" />
          </div>
          <img src={logo} alt="Logo" className="company-logo" />
        </div>
        <div className="header-right">
          <div className="logout-button">
            <Logout />
          </div>
        </div>
      </div>

      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="position-sticky">
          <ul className="nav flex-column">
          <h2 className="text-center">Admin</h2>
            <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <Link className="nav-link" to="/dashboard" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Dashboard</span>}
              </Link>
            </li>

            <li className={`nav-item ${location.pathname === '/a-viewproduct' ? 'active' : ''}`}>
              <Link className="nav-link" to="/a-viewproduct" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Products</span>}
              </Link>
            </li>
           

            <li className={`nav-item ${location.pathname === '/manager-view' ? 'active' : ''}`}>
              <Link className="nav-link" to="/manager-view" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Managers</span>}
              </Link>
            </li>

            <li className={`nav-item ${location.pathname === '/employee-register' ? 'active' : ''}`}>
              <Link className="nav-link" to="/employee-register" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text"> Employees</span>}
              </Link>
            </li>


            

         

            

           

           

          

            
            
            
            
            
           

            

            
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
