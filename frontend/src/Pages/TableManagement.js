import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import "./TableManagement.css";
import trashIcon from '../assests/images/Trash.png';
import chairIcon from '../assests/images/Vector.png';
import { getTables, createTable, deleteTable } from '../services/api';

function TableManagement() {
  const [tables, setTables] = useState([]);
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [chairCount, setChairCount] = useState("03");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setLoading(false);
    }
  };

  const handleCreateTable = async () => {
    try {
      // Get the next table number
      const existingNumbers = tables.map(table => 
        parseInt(table.name.split(' ')[1]) || 0
      );
      const nextNumber = Math.max(...existingNumbers, 0) + 1;
      
      const tableData = {
        name: newTableName || `Table ${String(nextNumber).padStart(2, "0")}`,
        chairs: parseInt(chairCount), // Convert to number for MongoDB
        status: "available"
      };
      
      console.log('Creating table with data:', tableData);
      const response = await createTable(tableData);
      console.log('Create response:', response);
      
      if (response.data) {
        setTables([...tables, response.data]);
        setShowAddTable(false);
        setNewTableName("");
        setChairCount("03");
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const handleDeleteTable = async (tableId) => {
    try {
      console.log('Deleting table with ID:', tableId); // Debug log
      const response = await deleteTable(tableId);
      if (response.status === 200) {
        const updatedTables = tables.filter(table => table._id !== tableId);
        setTables(updatedTables);
      }
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const filteredTables = tables.filter(table => {
    const searchLower = searchQuery.toLowerCase();
    return (
      table.name.toLowerCase().includes(searchLower) ||
      table.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="table-management">
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Tables</h1>
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by table number"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="tables-grid">
          {loading ? (
            <div>Loading tables...</div>
          ) : (
            <>
              {filteredTables.map((table) => (
                <div key={table._id} className="table-card">
                  <button 
                    className="table-action-button delete-buttonbtn"
                    onClick={() => handleDeleteTable(table._id)}
                  >
                    <img src={trashIcon} alt="Delete" className="action-icon" />
                  </button>
                  <div className="table-card-content">
                    <div className="table-number-no">{table.name}</div>
                  </div>
                  <div className="chair-count">
                    <img src={chairIcon} alt="Chair" className="chair-icon" />
                    <span>{table.chairs}</span>
                  </div>
                </div>
              ))}

              <div className="table-card add-table-card">
                {!showAddTable ? (
                  <div
                    className="add-table-placeholder"
                    onClick={() => setShowAddTable(true)}
                  >
                    <Plus className="add-icon" />
                    <div className="add-text">Add Table</div>
                  </div>
                ) : (
                  <div className="add-table-form">
                    <input
                      type="text"
                      placeholder="Table name (optional)"
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      className="table-name-input"
                    />
                    <div className="chair-select-container">
                      <div className="chair-label">Chair</div>
                      <select 
                        className="chair-select" 
                        value={chairCount}
                        onChange={(e) => setChairCount(e.target.value)}
                      >
                        {[1,2,3,4,5,6,8,10].map(num => (
                          <option key={num} value={String(num).padStart(2, "0")}>
                            {String(num).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleCreateTable}
                      className="create-button"
                    >
                      Create
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableManagement;