
import { getAllMembers, getMemberById, createMember as createMemberService, updateMember as updateMemberService, deleteMember as deleteMemberService } from '../services/memberService.js';

export const getMembers = async (req, res) => {
  try {
    const members = await getAllMembers();
    res.json(members);
  } catch (error) {
    console.error('[ERROR] getMembers:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const getMemberByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await getMemberById(id);
    res.json(member);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hội viên' ? 404 : 500).json({ error: error.message });
  }
};

export const createMemberController = async (req, res) => {
  try {
    const member = await createMemberService(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMemberController = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await updateMemberService(id, req.body);
    res.json(member);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hội viên' ? 404 : 500).json({ error: error.message });
  }
};

export const deleteMemberController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteMemberService(id);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Không tìm thấy hội viên' ? 404 : 500).json({ error: error.message });
  }
};