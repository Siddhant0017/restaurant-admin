import React, { useState, useEffect } from 'react';
import { getChefOrders, } from '../../services/api';
import './ChefOrders.css';

const ChefOrders = () => {
  const [chefData, setChefData] = useState([
    { id: "1", name: "Manesh", orders: 3 },
    { id: "2", name: "Pritam", orders: 7 },
    { id: "3", name: "Yash", orders: 5 },
    { id: "4", name: "Tenzen", orders: 8 },
  ]);

  useEffect(() => {
    fetchChefOrders();
  }, []);

  const fetchChefOrders = async () => {
    try {
      const response = await getChefOrders();
      const validatedData = response.data.map(chef => ({
        id: chef.id || Math.random().toString(36).substring(2, 9),
        name: chef.name || 'Unknown Chef',
        orders: chef.orders || 0
      }));
      setChefData(validatedData);
    } catch (error) {
      console.error('Error fetching chef orders:', error);
    }
  };

  return (
    <div className="chef-orders card">
      <div className="card-content">
        <div className="chef-table">
          <div className="chef-column">
            <h3 className="chef-header">Chef Name</h3>
            <div className="chef-list">
              {chefData.map((chef, index) => (
                <div key={`name-${chef.id || index}`} className="chef-name">
                  {chef.name}
                </div>
              ))}
            </div>
          </div>
          <div className="orders-column">
            <h3 className="chef-header">Order Taken</h3>
            <div className="orders-list">
              {chefData.map((chef, index) => (
                <div key={`orders-${chef.id || index}`} className="order-count">
                  {chef.orders}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefOrders;