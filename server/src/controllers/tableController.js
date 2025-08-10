import { getAllTables, getTableById, createTable as createTableService, updateTable as updateTableService, deleteTable as deleteTableService } from '../services/tableService.js';

export const getTablesController = async (req, res) => {
  try {
    const tables = await getAllTables();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTableByIdController = async (req, res) => {
  const { id } = req.params;
  try {
  const table = await getTableById(id);
    res.json(table);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy bàn' ? 404 : 500).json({ error: error.message });
  }
};

export const createTableController = async (req, res) => {
  try {
    const table = await createTableService(req.body);
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTableController = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await updateTableService(id, req.body);
    res.json(table);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy bàn' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteTableController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteTableService(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy bàn' ? 404 : 500).json({ error: error.message });
  }
};