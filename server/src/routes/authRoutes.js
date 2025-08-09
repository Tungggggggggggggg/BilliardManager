import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Đăng nhập
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM Staff WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) {
        return res.status(401).json({ error: 'Email không tồn tại' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Mật khẩu không đúng' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, position: user.position } });
    } catch (error) {
      res.status(500).json({ error: 'Lỗi đăng nhập' });
    }
  }
);

export default router;