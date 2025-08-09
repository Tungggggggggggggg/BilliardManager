import pool from '../config/database.js';

export const getAllRevenueData = async () => {
  try {
    const result = await pool.query('SELECT * FROM RevenueData ORDER BY month');
    return result.rows;
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu doanh thu');
  }
};