import { getAllInventoryItems, getInventoryItemById, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../services/inventoryService.js';

export const getInventoryItems = async (req, res) => {
  try {
    const items = await getAllInventoryItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInventoryItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getInventoryItemById(id);
    res.json(item);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy sản phẩm' ? 404 : 500).json({ error: error.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const item = await createInventoryItem(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await updateInventoryItem(id, req.body);
    res.json(item);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy sản phẩm' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteInventoryItem(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy sản phẩm' ? 404 : 500).json({ error: error.message });
  }
};