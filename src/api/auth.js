// 鉴权相关 API 封装，所有请求自动携带 Cookie


// ===============================
// MOCK 用户，仅开发环境使用，勿提交生产！
// ===============================
// MOCK 用户对象定义
// 后续可切换为独立 mock 文件或通过环境变量配置
export const MOCK_USER = {
  id: 0,
  username: 'devuser',
  gender: 'male', // 新增字段
  email: 'devuser@younghearts.com',
  password_hash: 'mocked_hash',
  nickname: '心青年开发者',
  avatar: '/src/assets/user.png',
  roles: ['volunteer'],
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  // VolunteerProfile 示例扩展字段
  volunteerProfile: {
    user_id: 0,
    full_name: '开发者志愿者',
    phone: '13800000000',
    public_email: 'volunteer@younghearts.com',
    is_public_visible: true,
    service_hours: 12.5,
    skills: ['陪伴', '心理疏导'],
    status: 'approved',
    work_status: 'online',
  },
  // ExpertProfile 示例扩展字段
  expertProfile: {
    user_id: 0,
    full_name: '开发者专家',
    title: '心理咨询师',
    organization: '心青年研究院',
    qualifications: ['https://example.com/cert1.png'],
    specialties: ['心理健康', '家庭关系'],
    phone: '13800000001',
    public_email: 'expert@younghearts.com',
    is_public_visible: false,
    status: 'approved',
  },
};

const API_BASE = '/api/auth';


export async function getCurrentUser() {
  // ===============================
  // MOCK 用户，仅开发环境使用，勿提交生产！
  // ===============================
  if (import.meta.env.MODE === 'development') {
    // Phase 2: 开发环境下直接返回 MOCK_USER
    // 返回结构与 /api/auth/me 保持一致，包含 user、roles、profile概要
    const { roles, volunteerProfile, expertProfile, ...baseUser } = MOCK_USER;
    // 只返回概要 profile 字段（如有）
    return {
      user: {
        ...baseUser,
        roles,
      },
      volunteerProfile: volunteerProfile ? {
        user_id: volunteerProfile.user_id,
        full_name: volunteerProfile.full_name,
        is_public_visible: volunteerProfile.is_public_visible,
        service_hours: volunteerProfile.service_hours,
        skills: volunteerProfile.skills,
        status: volunteerProfile.status,
        work_status: volunteerProfile.work_status,
      } : undefined,
      expertProfile: expertProfile ? {
        user_id: expertProfile.user_id,
        full_name: expertProfile.full_name,
        title: expertProfile.title,
        organization: expertProfile.organization,
        specialties: expertProfile.specialties,
        is_public_visible: expertProfile.is_public_visible,
        status: expertProfile.status,
      } : undefined,
    };
  }
  const res = await fetch(`${API_BASE}/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('未登录');
  return await res.json();
}

export async function login({ username, password }) {
  if (import.meta.env.MODE === 'development') {
    // mock 登录，直接返回 user 信息
    return {
      user: MOCK_USER,
      token: 'mocked_token',
    };
  }
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('登录失败');
  return await res.json();
}

export async function logout() {
  if (import.meta.env.MODE === 'development') {
    // mock 登出，返回成功
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('登出失败');
  return await res.json();
}
