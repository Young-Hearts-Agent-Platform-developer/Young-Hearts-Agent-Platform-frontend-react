// src/api/consult.js
// 历史会话相关 API 封装

import { API_BASE_URL } from '../config/apiConfig';

const API_BASE = `${API_BASE_URL}/api/consult`;

/**
 * 获取指定会话的历史消息
 * @param {number|string} id - 会话唯一标识（后端 id 字段）
 * @returns {Promise<Array>} 消息数组，结构与 openapi.json ConsultationMessage 一致
 */
export async function getSessionMessages(id) {
  if (!id) throw new Error('会话 id 不能为空');
  const url = `${API_BASE}/sessions/${id}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('获取历史消息失败');
  }
  return await res.json();
}
/**
 * 获取历史会话列表（标准结构：{ sessions: [...] }）
 * @returns {Promise<{ sessions: Array<{ sessionId: string, title: string, createdAt: string, lastMessage: string }> }>}
 */
export async function getSessions() {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('获取会话列表失败');
  }
  return await res.json();
}

/**
 * 创建新会话
 * @param {Object} [payload] - 可选参数，如 title
 * @returns {Promise<{ sessionId: string, title: string, createdAt: string, lastMessage: string }>}
 */
export async function createSession(payload = {}) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('新建会话失败');
  }
  return await res.json();
}
