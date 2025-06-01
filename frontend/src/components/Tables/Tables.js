import React, { useEffect, useState } from 'react';
import { getTables } from '../../services/api';
import './Tables.css';

const Tables = ({ tableStats }) => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  return (
    <div className="tables card">
      <div className="card-header">
        <div className="tables-header">
          <h3 className="card-title">Tables</h3>
          <div className="table-legend">
            <div className="legend-item">
              <div className="legend-dot reserved"></div>
              <span className="legend-text">Reserved</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot available"></div>
              <span className="legend-text">Available</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="table-grid">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`table-cell ${table.status}`}
            >
              <span className="table-name">{table.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tables;