import { getAllTables, getTableById, createTable, updateTable, deleteTable } from '../services/tableService.js';

export const getTables = async (req, res) => {
  try {
    const tables = await getAllTables();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTableById = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await getTableById(id);
    res.json(table);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy bàn' ? 404 : 500).json({ error: error.message });
  }
};

export const createTable = async (req, res) => {
  try {
    const table = await createTable(req.body);
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTable = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await updateTable(id, req.body);
    res.json(table);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy bàn' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteTable = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteTable(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy bàn' ? 404 : 500).json({ error: error.message });
  }
};