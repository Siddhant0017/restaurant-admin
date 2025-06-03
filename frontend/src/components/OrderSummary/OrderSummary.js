import React, { useState, useEffect } from 'react';
import { getOrderSummary } from '../../services/api';
import './OrderSummary.css';

const OrderSummary = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderData, setOrderData] = useState([
    { label: 'Served', value: '09', percentage: '41%', color: '#2a2a2a' },
    { label: 'Dine in', value: '05', percentage: '35%', color: '#666666' },
    { label: 'Take Away', value: '06', percentage: '24%', color: '#bababa' }
  ]);
  const [, setLoading] = useState(false);
  const [, setError] = useState(null);

  const periodOptions = ['Daily', 'Weekly'];
  
  useEffect(() => {
    fetchOrderSummary();
  }, [selectedPeriod]);

  const fetchOrderSummary = async () => {
    try {
      setLoading(true);
      // Convert period to lowercase for API
      const period = selectedPeriod.toLowerCase();
      const response = await getOrderSummary(period);
      if (response.data && response.data.length) {
        setOrderData(response.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching order summary:', err);
      
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };

  
  const getStrokeDasharray = () => {
    if (orderData && orderData.length >= 3) {
      const served = parseInt(orderData[0].percentage, 10) || 0;
      const dineIn = parseInt(orderData[1].percentage, 10) || 0;
      const takeAway = parseInt(orderData[2].percentage, 10) || 0;
      return `${served},${dineIn},${takeAway},100`;
    }
    return '33,33,33,100'; // Default equal segments
  };

  return (
    <div className="order-summary card">
      <div className="card-header">
        <div className="summary-header">
          <h3 className="card-title">Order Summary</h3>
          <div className="select summary-select">
            <div 
              className="select-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedPeriod}</span>
              <span className="select-arrow">▼</span>
            </div>
            <div className={`select-content ${isDropdownOpen ? 'active' : ''}`}>
              {periodOptions.map((option) => (
                <div
                  key={option}
                  className="select-item"
                  onClick={() => handlePeriodSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="summary-subtitle"></div>
      </div>
      <div className="card-content">
        <div className="order-stats">
          {orderData.map((item) => (
            <div key={item.label} className="order-stat">
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="donut-chart">
          <svg className="chart-svg" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="3"
            />
            {orderData.map((item, index) => (
              <path
                key={item.label}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={item.color}
                strokeWidth="3"
                strokeDasharray={getStrokeDasharray()}
                strokeDashoffset={index === 0 ? 0 : 
                               index === 1 ? -parseInt(orderData[0].percentage, 10) : 
                               -(parseInt(orderData[0].percentage, 10) + parseInt(orderData[1].percentage, 10))}
              />
            ))}
          </svg>
        </div>

        <div className="legend">
          {orderData.map((item) => (
            <div key={item.label} className="legend-item">
              <div className="legend-info">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="legend-label">{item.label}</span>
              </div>
              <span className="legend-percentage">({item.percentage})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;