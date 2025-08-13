
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
    const newMember = await createMemberService(req.body);
    res.status(201).json(newMember);
  } catch (error) {
    console.error("Backend error:", error);

    // Nếu service đã throw error với status và message rõ ràng
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    // Nếu là lỗi vi phạm unique constraint từ DB
    if (error.code === "23505") {
      let message = "Dữ liệu bị trùng";
      if (error.detail.includes("(phone)")) {
        message = "Số điện thoại đã được sử dụng";
      } else if (error.detail.includes("(email)")) {
        message = "Email đã được sử dụng";
      }
      return res.status(400).json({ message });
    }

    res.status(500).json({ message: "Lỗi khi tạo hội viên" });
  }
};





export const updateMemberController = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await updateMemberService(id, req.body);
    res.json(member);
  } catch (error) {
    if (
      error.message.includes('Số điện thoại đã được sử dụng') ||
      error.message.includes('Email đã được sử dụng')
    ) {
      return res.status(400).json({ error: error.message }); // Lỗi trùng dữ liệu
    }
    if (error.message === 'Không tìm thấy hội viên') {
      return res.status(404).json({ error: error.message }); // Không tìm thấy
    }
    res.status(500).json({ error: 'Lỗi khi cập nhật hội viên' }); // Lỗi hệ thống
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