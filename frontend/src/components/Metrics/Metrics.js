import React from 'react';
import './Metrics.css';
import chefIcon from '../../assests/images/chefIcon.jpg';
import orderIcon from '../../assests/images/TotalOrders.jpg';
import revenueIcon from '../../assests/images/BgRupees.jpg';
import clientIcon from '../../assests/images/ClientsIcon.jpg';
import Rupees from '../../assests/images/rupees.png';

const Metrics = ({ totalRevenue, totalOrders, totalClients }) => {
  const formatRevenue = (revenue) => {
    if (revenue >= 1000) {
      return `₹${(revenue / 1000).toFixed(1)}K`;
    }
    return `₹${revenue}`;
  };

  const metricsData = [
    { icon: chefIcon, value: '4', label: 'Active Chefs' },
    { icon: orderIcon, value: totalOrders, label: 'Total Orders' },
    { icon: revenueIcon, value: formatRevenue(totalRevenue), label: 'Total Revenue', additionalIcon: Rupees },
    { icon: clientIcon, value: totalClients, label: 'Total Clients' },
  ];

  return (  
    <div className="metrics">
      {metricsData.map((metric, index) => (
        <div key={index} className="metric-card">
          <div className="metric-icon">
            <img src={metric.icon} alt={metric.label} />
            {metric.additionalIcon && (
              <img 
                src={metric.additionalIcon} 
                alt="rupees" 
                className="rupees-icon"
              />
            )}
          </div>
          <div className="metric-frame">
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Metrics;