const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ name: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific table
router.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new table
router.post('/', async (req, res) => {
  const table = new Table({
    name: req.body.name,
    chairs: req.body.chairs,
    status: req.body.status || 'available'
  });

  try {
    const newTable = await table.save();
    res.status(201).json(newTable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a table
router.put('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });

    if (req.body.name) table.name = req.body.name;
    if (req.body.chairs) table.chairs = req.body.chairs;
    if (req.body.status) table.status = req.body.status;

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a table
router.delete('/:id', async (req, res) => {
  try {
    const result = await Table.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;