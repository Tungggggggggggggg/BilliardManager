import pool from '../config/database.js';

export const getAllInventoryItems = async () => {
  try {
    const result = await pool.query('SELECT * FROM InventoryItem ORDER BY id');
    return result.rows.map(item => ({
      ...item,
      price: item.price !== undefined ? Number(item.price) : item.price,
      costPrice: item.costprice !== undefined ? Number(item.costprice) : item.costprice,
      quantity: item.quantity !== undefined ? Number(item.quantity) : item.quantity
    }));
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu sản phẩm');
  }
};

export const getInventoryItemById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM InventoryItem WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    const item = result.rows[0];
    return {
      ...item,
      price: item.price !== undefined ? Number(item.price) : item.price,
      costPrice: item.costprice !== undefined ? Number(item.costprice) : item.costprice,
      quantity: item.quantity !== undefined ? Number(item.quantity) : item.quantity
    };
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
    const item = result.rows[0];
    return {
      ...item,
      price: item.price !== undefined ? Number(item.price) : item.price,
      costPrice: item.costprice !== undefined ? Number(item.costprice) : item.costprice,
      quantity: item.quantity !== undefined ? Number(item.quantity) : item.quantity
    };
  } catch (error) {
    throw new Error('Lỗi khi thêm sản phẩm');
  }
};

export const updateInventoryItem = async (id, { name, price, costPrice, unit, quantity }) => {
  try {
    const result = await pool.query(
      'UPDATE InventoryItem SET name = $1, price = $2, costPrice = $3, unit = $4, quantity = $5 WHERE id = $6 RETURNING *',
      [name, price, costPrice, unit, quantity, id]
    );
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    const item = result.rows[0];
    return {
      ...item,
      price: item.price !== undefined ? Number(item.price) : item.price,
      costPrice: item.costprice !== undefined ? Number(item.costprice) : item.costprice,
      quantity: item.quantity !== undefined ? Number(item.quantity) : item.quantity
    };
  } catch (error) {
    throw new Error('Lỗi khi cập nhật sản phẩm');
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const result = await pool.query('DELETE FROM InventoryItem WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return { message: 'Xóa sản phẩm thành công' };
  } catch (error) {
    throw new Error('Lỗi khi xóa sản phẩm');
  }
};