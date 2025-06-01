import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Metrics from '../components/Metrics/Metrics';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import RevenueChart from '../components/RevenueCharts/RevenueChart';
import Tables from '../components/Tables/Tables';
import ChefOrders from '../components/ChefOrders/ChefOrders';
import { getDashboardMetrics } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
    tables: { total: 0, available: 0, occupied: 0, reserved: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardMetrics();
      setMetrics(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      {loading ? (
        <div>Loading dashboard data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <Metrics 
            totalRevenue={metrics.totalRevenue} 
            totalOrders={metrics.totalOrders} 
            totalClients={metrics.totalClients} 
          />
          <div className="content-sections">
            <div className="section orderSummary">
              <OrderSummary />
            </div>
            <div className="section revenueCharts">
              <RevenueChart />
            </div>
            <div className="section tables">
              <Tables tableStats={metrics.tables} />
            </div>
          </div>
          <ChefOrders />
        </>
      )}
    </div>
  );
};

export default Dashboard;
