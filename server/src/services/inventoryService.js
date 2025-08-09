import pool from '../config/database.js';

export const getAllInventoryItems = async () => {
  try {
    const result = await pool.query('SELECT * FROM InventoryItem ORDER BY inventory_item_id');
    return result.rows;
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu sản phẩm');
  }
};

export const getInventoryItemById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM InventoryItem WHERE inventory_item_id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message || 'Lỗi truy vấn dữ liệu sản phẩm');
  }
};

export const createInventoryItem = async ({ name, price, costPrice, unit, quantity }) => {
  try {
    const result = await pool.query(
      'INSERT INTO InventoryItem (name, price, costPrice, unit, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, costPrice, unit, quantity]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Lỗi khi thêm sản phẩm');
  }
};

export const updateInventoryItem = async (id, { name, price, costPrice, unit, quantity }) => {
  try {
    const result = await pool.query(
      'UPDATE InventoryItem SET name = $1, price = $2, costPrice = $3, unit = $4, quantity = $5 WHERE inventory_item_id = $6 RETURNING *',
      [name, price, costPrice, unit, quantity, id]
    );
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error('Lỗi khi cập nhật sản phẩm');
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const result = await pool.query('DELETE FROM InventoryItem WHERE inventory_item_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return { message: 'Xóa sản phẩm thành công' };
  } catch (error) {
    throw new Error('Lỗi khi xóa sản phẩm');
  }
};