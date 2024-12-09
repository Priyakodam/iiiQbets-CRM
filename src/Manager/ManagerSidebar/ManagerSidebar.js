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
import "./ManagerSidebar.css";
import Header from  "../../Admin/Dashboard/Header";
import { useAuth } from  "../../Context/AuthContext";
import Logout from "../../Admin/Dashboard/Logout";
import logo from "../../Img/logocrm.png" ;



const ManagerSidebar = ({ onToggleSidebar }) => {
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
          <h2 className="text-center">{user.name}</h2>
            <li className={`nav-item ${location.pathname === '/m-dashboard' ? 'active' : ''}`}>
              <Link className="nav-link" to="/m-dashboard" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Dashboard</span>}
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === '/m-team' ? 'active' : ''}`}>
              <Link className="nav-link" to="/m-team" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">My Team</span>}
              </Link>
            </li>

            
            <li className={`nav-item ${location.pathname === '/m-addcustomers' ? 'active' : ''}`}>
              <Link className="nav-link" to="/m-addcustomers" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Customers</span>}
              </Link>
            </li>

            <li className={`nav-item ${location.pathname === '/m-addleads' ? 'active' : ''}`}>
              <Link className="nav-link" to="/m-addleads" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Leads</span>}
              </Link>
            </li>

            <li className={`nav-item ${location.pathname === '/m-quotation' ? 'active' : ''}`}>
              <Link className="nav-link" to="/m-quotation" onClick={handleNavItemClick}>
                <FaTachometerAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Quotations</span>}
              </Link>
            </li>

           
            

            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link className="nav-link" to="/" onClick={handleNavItemClick}>
                <FaSignOutAlt className="nav-icon" />
                {!collapsed && <span className="link_text">Logout</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ManagerSidebar;
