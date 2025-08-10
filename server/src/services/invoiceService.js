import pool from '../config/database.js';

export const getAllInvoices = async () => {
  try {
    const result = await pool.query('SELECT * FROM Invoice ORDER BY id');
    return result.rows.map(inv => ({
      ...inv,
      total: inv.total !== undefined ? Number(inv.total) : inv.total
    }));
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu hóa đơn');
  }
};

export const getInvoiceById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM Invoice WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hóa đơn');
    }
    const inv = result.rows[0];
    return {
      ...inv,
      total: inv.total !== undefined ? Number(inv.total) : inv.total
    };
  } catch (error) {
    throw new Error(error.message || 'Lỗi truy vấn dữ liệu hóa đơn');
  }
};

export const createInvoice = async ({ customer, phone, date, total, status, member_id }) => {
  try {
    const result = await pool.query(
      'INSERT INTO Invoice (customer, phone, date, total, status, member_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [customer, phone, date || new Date(), total, status, member_id || null]
    );
    const inv = result.rows[0];
    return {
      ...inv,
      total: inv.total !== undefined ? Number(inv.total) : inv.total
    };
  } catch (error) {
    throw new Error('Lỗi khi thêm hóa đơn');
  }
};

export const updateInvoice = async (id, { customer, phone, date, total, status, member_id }) => {
  try {
    const result = await pool.query(
      'UPDATE Invoice SET customer = $1, phone = $2, date = $3, total = $4, status = $5, member_id = $6 WHERE id = $7 RETURNING *',
      [customer, phone, date, total, status, member_id, id]
    );
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hóa đơn');
    }
    const inv = result.rows[0];
    return {
      ...inv,
      total: inv.total !== undefined ? Number(inv.total) : inv.total
    };
  } catch (error) {
    throw new Error('Lỗi khi cập nhật hóa đơn');
  }
};

export const deleteInvoice = async (id) => {
  try {
    const result = await pool.query('DELETE FROM Invoice WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hóa đơn');
    }
    return { message: 'Xóa hóa đơn thành công' };
  } catch (error) {
    throw new Error('Lỗi khi xóa hóa đơn');
  }
};

export const getInvoiceItems = async (invoiceId) => {
  try {
    const result = await pool.query('SELECT * FROM InvoiceItem WHERE id = $1', [invoiceId]);
    return result.rows;
  } catch (error) {
    throw new Error('Lỗi truy vấn dữ liệu mục hóa đơn');
  }
};

export const createInvoiceItem = async (invoiceId, { inventory_item_id, name, quantity, price }) => {
  try {
    const result = await pool.query(
      'INSERT INTO InvoiceItem (id, inventory_item_id, name, quantity, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [invoiceId, inventory_item_id, name, quantity, price]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Lỗi khi thêm mục hóa đơn');
  }
};