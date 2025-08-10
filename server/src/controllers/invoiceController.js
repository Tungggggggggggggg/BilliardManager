import { getAllInvoices, getInvoiceById, createInvoice as createInvoiceService, updateInvoice as updateInvoiceService, deleteInvoice as deleteInvoiceService, getInvoiceItems as getInvoiceItemsService, createInvoiceItem as createInvoiceItemService } from '../services/invoiceService.js';

export const getInvoicesController = async (req, res) => {
  try {
    const invoices = await getAllInvoices();
    res.json(invoices);
  } catch (error) {
    if (error.message && error.message.includes('character with byte sequence')) {
      console.error('Lỗi encoding dữ liệu hóa đơn:', error);
      res.status(500).json({ error: 'Lỗi encoding dữ liệu hóa đơn', detail: error.message });
    } else {
      console.error('Lỗi getInvoicesController:', error);
      res.status(500).json({ error: error.message, detail: error.stack });
    }
  }
};

export const getInvoiceByIdController = async (req, res) => {
  const { id } = req.params;
  try {
  const invoice = await getInvoiceById(id);
    res.json(invoice);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hóa đơn' ? 404 : 500).json({ error: error.message });
  }
};

export const createInvoiceController = async (req, res) => {
  try {
    const invoice = await createInvoiceService(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvoiceController = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await updateInvoiceService(id, req.body);
    res.json(invoice);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hóa đơn' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteInvoiceController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteInvoiceService(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hóa đơn' ? 404 : 500).json({ error: error.message });
  }
};

export const getInvoiceItemsController = async (req, res) => {
  const { id } = req.params;
  try {
    const items = await getInvoiceItemsService(id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInvoiceItemController = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await createInvoiceItemService(id, req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};