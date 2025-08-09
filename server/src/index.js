import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import revenueRoutes from './routes/revenueRoutes.js';
import pool from './config/database.js';
import rateLimit from 'express-rate-limit';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Connected to PostgreSQL', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/revenue', revenueRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});