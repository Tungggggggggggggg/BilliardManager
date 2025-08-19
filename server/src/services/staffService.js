import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const getAllStaff = async () => {
  try {
    const result = await pool.query(
      `SELECT id, staff_code, name, position, phone, email, birthday, gender, created_at 
       FROM staff 
       ORDER BY id`
    );
    return result.rows;
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu nhân viên');
  }
};

export const getStaffById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT id, staff_code, name, position, phone, email, birthday, gender, created_at 
       FROM staff 
       WHERE id = $1`,
      [id]
    );
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
    // Kiểm tra trùng email
    const emailCheck = await pool.query(
      `SELECT id FROM staff WHERE email = $1`,
      [email]
    );
    if (emailCheck.rows.length > 0) {
      throw new Error('Email đã được dùng');
    }

    // Kiểm tra trùng số điện thoại
    const phoneCheck = await pool.query(
      `SELECT id FROM staff WHERE phone = $1`,
      [phone]
    );
    if (phoneCheck.rows.length > 0) {
      throw new Error('Số điện thoại đã được dùng');
    }

    const lastStaff = await pool.query(
      `SELECT id FROM staff ORDER BY id DESC LIMIT 1`
    );
    const newId = lastStaff.rows.length > 0 ? lastStaff.rows[0].id + 1 : 1;
    const staff_code = `NV${String(newId).padStart(3, '0')}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdAt = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO staff (staff_code, name, position, phone, email, birthday, gender, password, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id, staff_code, name, position, phone, email, birthday, gender, created_at`,
      [staff_code, name, position, phone, email, birthday, gender, hashedPassword, createdAt]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating staff:', error);
    throw new Error(error.message || 'Lỗi khi thêm nhân viên');
  }
};


export const updateStaff = async (id, { name, position, phone, email, birthday, gender }) => {
  // Kiểm tra trùng email, trùng phone
  const emailCheck = await pool.query(
    `SELECT id FROM staff WHERE email = $1 AND id <> $2`,
    [email, id]
  );
  if (emailCheck.rows.length > 0) {
    throw new Error('Email đã được dùng');
  }

  const phoneCheck = await pool.query(
    `SELECT id FROM staff WHERE phone = $1 AND id <> $2`,
    [phone, id]
  );
  if (phoneCheck.rows.length > 0) {
    throw new Error('Số điện thoại đã được dùng');
  }

  const query = `
    UPDATE staff 
    SET name = $1, position = $2, phone = $3, email = $4, birthday = $5, gender = $6
    WHERE id = $7
    RETURNING id, staff_code, name, position, phone, email, birthday, gender, created_at
  `;
  const values = [name, position, phone, email, birthday, gender, id];

  const result = await pool.query(query, values);
  if (result.rows.length === 0) {
    throw new Error('Không tìm thấy nhân viên');
  }
  return result.rows[0];
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
