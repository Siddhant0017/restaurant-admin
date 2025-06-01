import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import dashboardIcon from '../../assests/icons/DashboardIcon.png';
import tablesIcon from '../../assests/icons/TableIcon.png';
import orderlineIcon from '../../assests/icons/orderIcon.png';
import userviewIcon from '../../assests/icons/UserViewIcon.png';
// Fix the background icons import
import BgImage from '../../assests/images/Bg.png';

const menuItems = [
  { 
    icon: dashboardIcon, 
    bgIcon: BgImage,  
    label: 'Dashboard', 
    path: '/',
    bgClass: 'dashboard-bg'
  },
  { 
    icon: tablesIcon, 
    bgIcon: BgImage,  
    label: 'Tables', 
    path: '/tables',
    bgClass: 'tables-bg'
  },
  { 
    icon: orderlineIcon, 
    bgIcon: BgImage, 
    label: 'OrderLine', 
    path: '/orderline',
    bgClass: 'orderline-bg'
  },
  { 
    icon: userviewIcon, 
    bgIcon: BgImage, 
    label: 'User UI View', 
    path: '/userview',
    bgClass: 'userview-bg'
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`sidebar-btn ${location.pathname === item.path ? 'active' : ''}`}
          title={item.label}
        >
          <img src={item.bgIcon} alt="" className={`sidebar-bg ${item.bgClass}`} />
          <img src={item.icon} alt={item.label} className="sidebar-icon" />
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;