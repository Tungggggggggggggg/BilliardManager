import { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, getInvoiceItems, createInvoiceItem } from '../services/invoiceService.js';

export const getInvoices = async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await getInvoiceById(id);
    res.json(invoice);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hóa đơn' ? 404 : 500).json({ error: error.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const invoice = await createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await updateInvoice(id, req.body);
    res.json(invoice);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hóa đơn' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteInvoice(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hóa đơn' ? 404 : 500).json({ error: error.message });
  }
};

export const getInvoiceItems = async (req, res) => {
  const { id } = req.params;
  try {
    const items = await getInvoiceItems(id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInvoiceItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await createInvoiceItem(id, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};