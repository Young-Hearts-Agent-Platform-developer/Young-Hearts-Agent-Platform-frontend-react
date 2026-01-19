// src/api/consult.js
// 历史会话相关 API 封装
import axios from 'axios';

/**
 * 获取历史会话列表
 * @returns {Promise<Array<{sessionId: string, title: string, createdAt: string, lastMessage: string}>>}
 */
export async function getSessions() {
  const res = await axios.get('/api/consult/sessions');
  return res.data;
}

/**
 * 创建新会话
 * @param {Object} [payload] - 可选参数，如 title
 * @returns {Promise<{sessionId: string, title: string, createdAt: string, lastMessage: string}>}
 */
export async function createSession(payload = {}) {
  const res = await axios.post('/api/consult/sessions', payload);
  return res.data;
}
