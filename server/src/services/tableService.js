import pool from '../config/database.js';

export const getAllTables = async () => {
  try {
    const result = await pool.query('SELECT * FROM TablesManagement ORDER BY id');
    return result.rows.map(table => ({
      ...table,
      id: table.id !== undefined ? Number(table.id) : table.id,
      usageTime: table.usagetime !== undefined ? Number(table.usagetime) : table.usagetime,
      revenue: table.revenue !== undefined ? Number(table.revenue) : table.revenue
    }));
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu bàn');
  }
};

export const getTableById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM TablesManagement WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy bàn');
    }
    const table = result.rows[0];
    return {
      ...table,
      id: table.id !== undefined ? Number(table.id) : table.id,
      usageTime: table.usagetime !== undefined ? Number(table.usagetime) : table.usagetime,
      revenue: table.revenue !== undefined ? Number(table.revenue) : table.revenue
    };
  } catch (error) {
    throw new Error(error.message || 'Lỗi truy vấn dữ liệu bàn');
  }
};

export const createTable = async ({ status, usageTime, revenue }) => {
  try {
    const result = await pool.query(
      'INSERT INTO TablesManagement (status, usageTime, revenue) VALUES ($1, $2, $3) RETURNING *',
      [status, usageTime || 0, revenue || 0]
    );
    const table = result.rows[0];
    return {
      ...table,
      id: table.id !== undefined ? Number(table.id) : table.id,
      usageTime: table.usagetime !== undefined ? Number(table.usagetime) : table.usagetime,
      revenue: table.revenue !== undefined ? Number(table.revenue) : table.revenue
    };
  } catch (error) {
    throw new Error('Lỗi khi thêm bàn');
  }
};

export const updateTable = async (id, { status, usageTime, revenue }) => {
  try {
    const result = await pool.query(
      'UPDATE TablesManagement SET status = $1, usageTime = $2, revenue = $3 WHERE id = $4 RETURNING *',
      [status, usageTime, revenue, id]
    );
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy bàn');
    }
    const table = result.rows[0];
    return {
      ...table,
      id: table.id !== undefined ? Number(table.id) : table.id,
      usageTime: table.usagetime !== undefined ? Number(table.usagetime) : table.usagetime,
      revenue: table.revenue !== undefined ? Number(table.revenue) : table.revenue
    };
  } catch (error) {
    throw new Error('Lỗi khi cập nhật bàn');
  }
};

export const deleteTable = async (id) => {
  try {
    const result = await pool.query('DELETE FROM TablesManagement WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy bàn');
    }
    return { message: 'Xóa bàn thành công' };
  } catch (error) {
    throw new Error('Lỗi khi xóa bàn');
  }
};