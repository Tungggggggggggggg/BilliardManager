import { getAllInventoryItems, getInventoryItemById, createInventoryItem as createInventoryItemService, updateInventoryItem as updateInventoryItemService, deleteInventoryItem as deleteInventoryItemService } from '../services/inventoryService.js';

export const getInventoryItemsController = async (req, res) => {
  try {
    const items = await getAllInventoryItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInventoryItemByIdController = async (req, res) => {
  const { id } = req.params;
  try {
  const item = await getInventoryItemById(id);
    res.json(item);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy sản phẩm' ? 404 : 500).json({ error: error.message });
  }
};

export const createInventoryItemController = async (req, res) => {
  try {
    const item = await createInventoryItemService(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInventoryItemController = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await updateInventoryItemService(id, req.body);
    res.json(item);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy sản phẩm' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteInventoryItemController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteInventoryItemService(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy sản phẩm' ? 404 : 500).json({ error: error.message });
  }
};