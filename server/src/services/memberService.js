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
    const phoneCheck = await pool.query(
      'SELECT 1 FROM MemberData WHERE phone = $1',
      [phone]
    );
    if (phoneCheck.rows.length > 0) {
      const error = new Error('Số điện thoại đã được sử dụng');
      error.status = 400;
      throw error;
    }

    const emailCheck = await pool.query(
      'SELECT 1 FROM MemberData WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      const error = new Error('Email đã được sử dụng');
      error.status = 400;
      throw error;
    }

    const result = await pool.query(
      `INSERT INTO MemberData 
        (full_name, gender, birthdate, phone, email, total_spent, join_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [full_name, gender, birthdate, phone, email, total_spent || 0, join_date || new Date()]
    );

    return result.rows[0];
  } catch (error) {
    // Nếu là lỗi đã biết, trả nguyên message
    if (error.status) {
      throw error;
    }

    // Nếu là lỗi từ DB (trùng UNIQUE constraint)
    if (error.code === '23505') {
      if (error.detail.includes('(phone)')) {
        const e = new Error('Số điện thoại đã được sử dụng');
        e.status = 400;
        throw e;
      }
      if (error.detail.includes('(email)')) {
        const e = new Error('Email đã được sử dụng');
        e.status = 400;
        throw e;
      }
    }

    // Lỗi khác
    const e = new Error('Lỗi khi thêm hội viên');
    e.status = 500;
    throw e;
  }
};



export const updateMember = async (id, { full_name, gender, birthdate, phone, email, total_spent }) => {
  try {
    // Kiểm tra số điện thoại trùng (khác chính mình)
    const phoneCheck = await pool.query(
      'SELECT 1 FROM MemberData WHERE phone = $1 AND member_id != $2',
      [phone, id]
    );
    if (phoneCheck.rows.length > 0) {
      throw new Error('Số điện thoại đã được sử dụng');
    }

    // Kiểm tra email trùng (khác chính mình)
    const emailCheck = await pool.query(
      'SELECT 1 FROM MemberData WHERE email = $1 AND member_id != $2',
      [email, id]
    );
    if (emailCheck.rows.length > 0) {
      throw new Error('Email đã được sử dụng');
    }

    const result = await pool.query(
      'UPDATE MemberData SET full_name = $1, gender = $2, birthdate = $3, phone = $4, email = $5, total_spent = $6 WHERE member_id = $7 RETURNING *',
      [full_name, gender, birthdate, phone, email, total_spent, id]
    );
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hội viên');
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(error.message || 'Lỗi khi cập nhật hội viên');
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