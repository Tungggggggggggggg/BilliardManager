import { getAllRevenueData } from '../services/revenueService.js';

export const getRevenueData = async (req, res) => {
  try {
    const revenueData = await getAllRevenueData();
    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};