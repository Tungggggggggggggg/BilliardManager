import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getAllStaff = async () => {
  try {
    const result = await pool.query('SELECT id, staff_code, name, position, phone, email, birthday, gender, created_at FROM staff ORDER BY id');
    return result.rows;
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu nhân viên');
  }
};

export const getStaffById = async (id) => {
  try {
    const result = await pool.query('SELECT id, staff_code, name, position, phone, email, birthday, gender, created_at FROM staff WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy nhân viên');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message || 'Lỗi truy vấn dữ liệu nhân viên');
  }
};

export const createStaff = async ({ name, position, phone, email, birthday, gender, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO staff (name, position, phone, email, birthday, gender, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, staff_code, name, position, phone, email, birthday, gender, created_at',
      [name, position, phone, email, birthday, gender, hashedPassword]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Lỗi khi thêm nhân viên');
  }
};

export const updateStaff = async (id, { name, position, phone, email, birthday, gender, password }) => {
  try {
    let query = 'UPDATE staff SET name = $1, position = $2, phone = $3, email = $4, birthday = $5, gender = $6';
    const values = [name, position, phone, email, birthday, gender];
    let index = 7;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = $${index}`;
      values.push(hashedPassword);
      index++;
    }

    query += ` WHERE id = $${index} RETURNING id, staff_code, name, position, phone, email, birthday, gender, created_at`;
    values.push(id);

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy nhân viên');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error('Lỗi khi cập nhật nhân viên');
  }
};

export const deleteStaff = async (id) => {
  try {
    const result = await pool.query('DELETE FROM staff WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy nhân viên');
    }
    return { message: 'Xóa nhân viên thành công' };
  } catch (error) {
    throw new Error('Lỗi khi xóa nhân viên');
  }
};