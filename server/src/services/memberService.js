import pool from '../config/database.js';

export const getAllMembers = async () => {
  try {
    const result = await pool.query('SELECT * FROM MemberData ORDER BY member_id');
    return result.rows;
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu hội viên');
  }
};

export const getMemberById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM MemberData WHERE member_id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hội viên');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message || 'Lỗi truy vấn dữ liệu hội viên');
  }
};

export const createMember = async ({ full_name, gender, birthdate, phone, email, total_spent, join_date }) => {
  try {
    const result = await pool.query(
      'INSERT INTO MemberData (full_name, gender, birthdate, phone, email, total_spent, join_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [full_name, gender, birthdate, phone, email, total_spent || 0, join_date || new Date()]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Lỗi khi thêm hội viên');
  }
};

export const updateMember = async (id, { full_name, gender, birthdate, phone, email, total_spent }) => {
  try {
    const result = await pool.query(
      'UPDATE MemberData SET full_name = $1, gender = $2, birthdate = $3, phone = $4, email = $5, total_spent = $6 WHERE member_id = $7 RETURNING *',
      [full_name, gender, birthdate, phone, email, total_spent, id]
    );
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hội viên');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error('Lỗi khi cập nhật hội viên');
  }
};

export const deleteMember = async (id) => {
  try {
    const result = await pool.query('DELETE FROM MemberData WHERE member_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hội viên');
    }
    return { message: 'Xóa hội viên thành công' };
  } catch (error) {
    throw new Error('Lỗi khi xóa hội viên');
  }
};