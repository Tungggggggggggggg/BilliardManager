import { getAllStaff, getStaffById, createStaff as createStaffService, updateStaff as updateStaffService, deleteStaff as deleteStaffService } from '../services/staffService.js';

export const getStaffController = async (req, res) => {
  try {
    const staff = await getAllStaff();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStaffByIdController = async (req, res) => {
  const { id } = req.params;
  try {
  const staffMember = await getStaffById(id);
    res.json(staffMember);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy nhân viên' ? 404 : 500).json({ error: error.message });
  }
};

export const createStaffController = async (req, res) => {
  try {
    const staffMember = await createStaffService(req.body);
    res.status(201).json(staffMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStaffController = async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await updateStaffService(id, req.body);
    res.json(staffMember);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy nhân viên' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteStaffController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteStaffService(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy nhân viên' ? 404 : 500).json({ error: error.message });
  }
};