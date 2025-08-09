import { getAllMembers, getMemberById, createMember, updateMember, deleteMember } from '../services/memberService.js';

export const getMembers = async (req, res) => {
  try {
    const members = await getAllMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await getMemberById(id);
    res.json(member);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hội viên' ? 404 : 500).json({ error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const member = await createMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMember = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await updateMember(id, req.body);
    res.json(member);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hội viên' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteMember(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hội viên' ? 404 : 500).json({ error: error.message });
  }
};