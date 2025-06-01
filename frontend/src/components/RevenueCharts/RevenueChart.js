import React, { useState } from 'react';
import './RevenueChart.css';

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const periodOptions = ['Daily', 'Weekly'];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };

  return (
    <div className="revenue-chart card">
      <div className="card-header">
        <div className="revenue-header">
          <h3 className="card-title">Revenue</h3>
          <div className="select revenue-select">
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
        <div className="revenue-subtitle"></div>
      </div>
      <div className="card-content">
        <div className="chart-container">
          <svg className="revenue-svg" viewBox="0 0 300 150">
            <path 
              d="M 20 120 Q 60 80 100 90 T 180 60 T 260 40" 
              stroke="#2a2a2a" 
              strokeWidth="2" 
              fill="none" 
            />
          </svg>
        </div>
        <div className="chart-labels">
          {weekDays.map((day) => (
            <span key={day} className="chart-label">{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;