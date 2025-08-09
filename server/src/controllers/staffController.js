import { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff } from '../services/staffService.js';

export const getStaff = async (req, res) => {
  try {
    const staff = await getAllStaff();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await getStaffById(id);
    res.json(staffMember);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy nhân viên' ? 404 : 500).json({ error: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const staffMember = await createStaff(req.body);
    res.status(201).json(staffMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await updateStaff(id, req.body);
    res.json(staffMember);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy nhân viên' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteStaff(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy nhân viên' ? 404 : 500).json({ error: error.message });
  }
};