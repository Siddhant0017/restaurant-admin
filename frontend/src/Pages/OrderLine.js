import React, { useState, useEffect } from 'react';
import { updateOrderStatus, getOrders, getTables } from '../services/api';
import './OrderLine.css';
import ProcessingIcon from '../assests/icons/time.png';
import CheckcircleIcon from '../assests/icons/Vector.png';
import TakeawayCirclIcon from '../assests/icons/Takeaway.png';
import UtensilIcon from '../assests/icons/Utensil.png';


const OrderCard = ({
  orderId,
  orderNumber,
  tableNumber,
  time,
  itemCount,
  items,
  status,
  type,
  preparationTime,
  onStatusChange
}) => {
  
  const [remainingTime, setRemainingTime] = useState(() => {
    if (status === 'served' || status === 'delivered') {
      return 0;
    }
    return preparationTime || 20;
  });
  
  
  const [currentStatus, setCurrentStatus] = useState(() => {
    if (status === 'pending' || status === 'preparing') {
      return type; 
    }
    return status; //  actual status for other states
  });

  // Update component when status prop changes
  useEffect(() => {
    if (status === 'served' || status === 'delivered') {
      setRemainingTime(0);
    }
    
    if (status !== 'pending' && status !== 'preparing') {
      setCurrentStatus(status);
    }
  }, [status]);

  const handleRefresh = async () => {
    if (remainingTime > 0) {
      const newTime = remainingTime - 5;
      if (newTime <= 0) {
        setRemainingTime(0);
        //  appropriate final status based on order type
        const newStatus = type === 'takeaway' ? 'delivered' : 'served';
        setCurrentStatus(newStatus);
        // Update status in MongoDB
        await onStatusChange(orderId, newStatus);
      } else {
        setRemainingTime(newTime);
      }
    }
  };

  const getStatusInfo = () => {
    if (remainingTime <= 0) {
      if (currentStatus === 'delivered') {
        return {
          label: "Done",
          subtitle: "Not Picked Up",
          buttonText: "Order Done",
          statusIcon: CheckcircleIcon,
          color: "#4CAF50"
        };
      } else if (currentStatus === 'served') {
        return {
          label: "Done",
          subtitle: "Served",
          buttonText: "Order Done",
          statusIcon: CheckcircleIcon,
          color: "#4CAF50"
        };
      }
    }

    switch (currentStatus) {
      case "dine-in":
        return {
          label: "Dine In",
          subtitle: `Ongoing: ${remainingTime} Min`,
          buttonText: "Processing",
          statusIcon: ProcessingIcon
        };
      case "takeaway":
        return {
          label: "Take Away",
          subtitle: `Ready in: ${remainingTime} Min`,
          buttonText: "Processing",
          statusIcon: TakeawayCirclIcon
        };
      case "served":
        return {
          label: "Done",
          subtitle: "Served",
          buttonText: "Order Done",
          statusIcon: CheckcircleIcon
        };
      case "delivered":
        return {
          label: "Done",
          subtitle: "Not Picked Up",
          buttonText: "Order Done",
          statusIcon: CheckcircleIcon
        };
      default:
        return {
          label: "Unknown",
          subtitle: "",
          buttonText: "Processing",
          statusIcon: ProcessingIcon
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`order-card-container ${currentStatus}`}>
      
      <div className="status-badge-bottom">
        <div 
          className={`processing-badge ${currentStatus}`}
          onClick={handleRefresh} 
          style={{ cursor: 'pointer' }} 
        >
          <span className="processing-text">{statusInfo.buttonText}</span>
          <img 
            className="time-icon" 
            alt={statusInfo.buttonText} 
            src={statusInfo.statusIcon}
          />
        </div>
      </div>

    
      <div className="order-items-section">
        <div className="items-container-white">
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <div className="item-quantity">{item.quantity} x</div>
              <div className="item-name">{item.name}</div>
              {item.note && (
                <div className="item-note">{item.note}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="order-header-section">
        <div className="header-container-white">
          <div className="status-badge-header">
            <div className={`status-pill ${currentStatus}`}>
              <div className="status-label">{statusInfo.label}</div>
              <div className="status-subtitle">{statusInfo.subtitle}</div>
            </div>
          </div>

          <div className="order-number-section">
            <img className="vector-icon" alt="Vector" src={UtensilIcon} />
            <div className="order-number-text"># {orderNumber}</div>
          </div>

          <div className="table-time-info">
            <div className="table-number">{tableNumber}</div>
            <div className="order-time">{time}</div>
          </div>

          <div className="item-count-display">{itemCount} Item</div>
        </div>
      </div>
    </div>
  );
};

// Update the main OrderLine component
export default function OrderLine() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, tablesResponse] = await Promise.all([
          getOrders(),
          getTables()
        ]);
        setOrders(ordersResponse.data);
        setTables(tablesResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update order status in MongoDB
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const mapOrderToCardProps = (order) => {
    const preparationTime = order.items.reduce((total, item) => {
      return total + (item.quantity * 20);
    }, 0);

    // Format order number to extract and pad with zeros
    const orderNumberStr = order.orderNumber.split('-')[1];  
    const formattedOrderNumber = orderNumberStr.padStart(2, '0');  

    // Get table name for dine-in orders
    let tableNumber;
    if (order.type === 'dine-in' && order.tableId) {
      const matchingTable = tables.find(table => table._id === order.tableId);
      tableNumber = matchingTable ? matchingTable.name : 'Takeaway';
    } else {
      tableNumber = 'Table-01';
    }

    return {
      orderId: order._id,
      orderNumber: formattedOrderNumber, 
      tableNumber: tableNumber,
      time: new Date(order.createdAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      itemCount: order.items.length,
      items: order.items.map(item => ({
        quantity: item.quantity,
        name: item.name,
        note: item.note || null
      })),
      status: order.status,
      type: order.type,
      preparationTime: (order.status === 'served' || order.status === 'delivered') ? 0 : preparationTime
    };
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error}</div>;

  return (
    <div className="order-line">
      <h1>Order Line</h1>
      <div className="orders-container">
        {orders.map(order => (
          <OrderCard
            key={order._id}
            {...mapOrderToCardProps(order)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}