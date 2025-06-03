import React, { useState, useEffect } from 'react';
import './UserView.css';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import axios from 'axios';

const UserView = () => {
  const [categories] = useState([
    { name: "Burger", icon: "🍔" },
    { name: "Pizza", icon: "🍕" },
    { name: "Drink", icon: "🥤" },
    { name: "French fries", icon: "🍟" },
    { name: "Veggies", icon: "🥗" },
  ]);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState({ name: '', price: '' });
  const [selectedCategory, setSelectedCategory] = useState("Pizza");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await getMenuItems(selectedCategory.toLowerCase());
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.name);
  };

  const handleAddItem = async (newItem, imageFile) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        imageUrl = uploadResponse.data.imageUrl;
      }
  
      const response = await createMenuItem({
        ...newItem,
        image: imageUrl,
        category: selectedCategory.toLowerCase(),
        available: true
      });
      setMenuItems([...menuItems, response.data]);
      setEditingItem({ name: '', price: '' });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (id, updatedItem, imageFile) => {
    try {
      let imageUrl = updatedItem.image;
  
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        imageUrl = uploadResponse.data.imageUrl;
      }
  
      const response = await updateMenuItem(id, { ...updatedItem, image: imageUrl });
      const updatedList = menuItems.map(item => item._id === id ? response.data : item);
      setMenuItems(updatedList);
      setEditingItem({ name: '', price: '' });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
      try {
        await deleteMenuItem(id);
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };
  
    const handleToggleAvailability = async (id, currentAvailability) => {
      try {
        const response = await updateMenuItem(id, { available: !currentAvailability });
        const updatedList = menuItems.map(item => 
          item._id === id ? response.data : item
        );
        setMenuItems(updatedList);
      } catch (error) {
        console.error('Error updating availability:', error);
      }
    };

    
    const [showForm, setShowForm] = useState(false);
    
   
    return (
      <div className="admin-view">
        <header className="admin-header">
          <h1>{selectedCategory} Menu</h1>
          <button 
            className="add-new-button"
            onClick={() => {
              setEditingItem({ name: '', price: '' });
              setShowForm(true);
            }}
          >
            Add New Item
          </button>
        </header>
    
        
        <div className="category-tabs">
          {categories.map(category => (
            <button 
              key={category.name} 
              className={`category-tab ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
    
        
        {showForm && (
          <div className="admin-modal">
            <h3>{editingItem._id ? 'Edit Item' : 'Add New Item'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const itemData = {
                name: formData.get('name'),
                price: Number(formData.get('price')),
              };
    
              if (editingItem._id) {
                handleEditItem(editingItem._id, itemData, selectedFile);
              } else {
                handleAddItem(itemData, selectedFile);
              }
              setShowForm(false);
            }}>
              
              <div className="form-group">
                <label htmlFor="name">Item Name</label>
                <input
                  id="name"
                  name="name"
                  defaultValue={editingItem.name || ''}
                  placeholder="Enter item name"
                  required
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingItem.price || ''}
                  placeholder="Enter price"
                  required
                />
              </div>
    
              <div className="form-group">
                <label htmlFor="image">Item Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
    
              <div className="form-group">
                <label>Category</label>
                <div className="selected-category">
                  <span className="category-icon">
                    {categories.find(c => c.name === selectedCategory)?.icon}
                  </span>
                  <span>{selectedCategory}</span>
                </div>
              </div>
    
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => {
                    setEditingItem({ name: '', price: '' });
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingItem._id ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        )}
    
       
        <div className="items-container">
          <h2 className="category-title">{selectedCategory} Items</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading items...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="empty-state">
              <p>No items found in this category</p>
            </div>
          ) : (
            
            <div className="items-table">
              {menuItems.map(item => (
                <div key={item._id} className="table-row">
                  <div className="item-name">{item.name}</div>
                  <div className="col-price">₹{item.price}</div>
                  <div className="col-actions">
                    <button 
                      className="action-button edit"
                      onClick={() => setEditingItem(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </button>
                    <button 
                      className={`action-button ${item.available ? 'available' : 'unavailable'}`}
                      onClick={() => handleToggleAvailability(item._id, item.available)}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
};

export default UserView;
