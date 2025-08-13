import { body, validationResult } from 'express-validator';

export const validateMember = [
  body('full_name').notEmpty().withMessage('Họ tên không được để trống'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('phone').matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  body('birthdate').isDate().withMessage('Ngày sinh không hợp lệ'),
  body('gender').isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính không hợp lệ'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateInventoryItem = [
  body('name').notEmpty().withMessage('Tên sản phẩm không được để trống'),
  body('price').isFloat({ min: 0 }).withMessage('Giá phải lớn hơn hoặc bằng 0'),
  body('costPrice').isFloat({ min: 0 }).withMessage('Giá nhập phải lớn hơn hoặc bằng 0'),
  body('unit').notEmpty().withMessage('Đơn vị không được để trống'),
  body('quantity').isInt({ min: 0 }).withMessage('Số lượng phải lớn hơn hoặc bằng 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware validate cho tạo nhân viên: password bắt buộc
export const validateStaffCreate = [
  body('name').notEmpty().withMessage('Họ tên không được để trống'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('phone').matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  body('birthday').isDate().withMessage('Ngày sinh không hợp lệ'),
  body('gender').isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính không hợp lệ'),
  body('position').notEmpty().withMessage('Chức vụ không được để trống'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải dài ít nhất 6 ký tự'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware validate cho cập nhật nhân viên: password không bắt buộc, nếu có thì phải đủ 6 ký tự
export const validateStaffUpdate = [
  body('name').notEmpty().withMessage('Họ tên không được để trống'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('phone').matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  body('birthday').isDate().withMessage('Ngày sinh không hợp lệ'),
  body('gender').isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính không hợp lệ'),
  body('position').notEmpty().withMessage('Chức vụ không được để trống'),
  body('password').optional().isLength({ min: 6 }).withMessage('Mật khẩu phải dài ít nhất 6 ký tự'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateTable = [
  body('status').isIn(['Trống', 'Đang dùng', 'Đã đặt']).withMessage('Trạng thái không hợp lệ'),
  body('usageTime').isInt({ min: 0 }).withMessage('Thời gian sử dụng phải lớn hơn hoặc bằng 0'),
  body('revenue').isFloat({ min: 0 }).withMessage('Doanh thu phải lớn hơn hoặc bằng 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateInvoice = [
  body('customer').notEmpty().withMessage('Tên khách hàng không được để trống'),
  body('phone').matches(/^[0-9]{10,11}$/).withMessage('Số điện thoại không hợp lệ'),
  body('date').isDate().withMessage('Ngày không hợp lệ'),
  body('total').isFloat({ min: 0 }).withMessage('Tổng tiền phải lớn hơn hoặc bằng 0'),
  body('status').isIn(['Đã thanh toán', 'Chưa thanh toán']).withMessage('Trạng thái không hợp lệ'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateInvoiceItem = [
  body('invoice_id').notEmpty().withMessage('ID hóa đơn không được để trống'),
  body('inventory_item_id').isInt({ min: 1 }).withMessage('ID sản phẩm không hợp lệ'),
  body('name').notEmpty().withMessage('Tên sản phẩm không được để trống'),
  body('quantity').isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0'),
  body('price').isFloat({ min: 0 }).withMessage('Giá phải lớn hơn hoặc bằng 0'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
