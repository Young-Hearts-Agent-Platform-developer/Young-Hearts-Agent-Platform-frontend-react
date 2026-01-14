// 角色映射表，根据功能文档定义
const roleMapping = {
  'patient_family': '患者家属',
  'volunteer': '志愿者',
  'expert': '专家',
  'admin': '管理员',
  'maintainer': '维护人员'
};

/**
 * 获取角色的中文显示名称
 * @param {string} role - 英文角色字符串
 * @returns {string} 中文显示名称，如果未找到映射则返回原字符串
 */
export function getRoleDisplayName(role) {
  return roleMapping[role] || role;
}
