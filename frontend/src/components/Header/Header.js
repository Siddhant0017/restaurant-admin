import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [selectedFilter, setSelectedFilter] = useState('null');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filterOptions = [
    { value: 'orderSummary', label: 'Order Summary' },
    { value: 'revenueCharts', label: 'Revenue Charts' },
    { value: 'tables', label: 'Tables' }
  ];

  const handleFilterSelect = (value, label) => {
    setSelectedFilter(value);
    setIsDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('filterChange', { 
      detail: { 
        selectedFilter: value,
        timestamp: Date.now() // Add timestamp to ensure event is unique
      }
    }));
  };

  //  handle blur class on body
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      if (section.classList.contains(selectedFilter)) {
        section.classList.add('focused-section');
        section.classList.remove('blur-background');
      } else {
        section.classList.remove('focused-section');
        section.classList.add('blur-background');
      }
    });
  }, [selectedFilter]);

  return (
    <div className="header">
      <h1 className="header-title">Analytics</h1>
      <div className="header-filter">
        <div className={`select ${isDropdownOpen ? 'active' : ''}`}>
          <div 
            className="select-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{filterOptions.find(option => option.value === selectedFilter)?.label || 'Select View'}</span>
            <span className="select-arrow">▼</span>
          </div>
          <div className={`select-content ${isDropdownOpen ? 'active' : ''}`}>
            {filterOptions.map((option) => (
              <div
                key={option.value}
                className="select-item"
                onClick={() => handleFilterSelect(option.value, option.label)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;