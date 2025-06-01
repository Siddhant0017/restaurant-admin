import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './Pages/Dashboard';
import TableManagement from './Pages/TableManagement';
import OrderLine from './Pages/OrderLine';
import UserView from './Pages/UserView';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tables" element={<TableManagement />} />
            <Route path="/orderline" element={<OrderLine />} />
            <Route path="/userview" element={<UserView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;