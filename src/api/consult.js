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
 * chatSSE - 基于 fetch+ReadableStream 的 AI 对话流式接口（POST SSE，对齐 openapi）
 * @param {import('../types/ChatRequest').ChatRequest} params - 请求参数，结构需与 openapi 对齐（session_id, query, role, reasoning_effort）
 * @param {function} onMessage - 每段消息回调 (data, {isTopic, isError, isDone})
 * @param {function} onError - 错误回调 (error)
 * @param {function} onComplete - 完成回调 ()
 * @returns {Promise<function>} 返回关闭流的函数
 *
 * 用法：
 * chatSSE({ session_id, query, role, reasoning_effort }, { onMessage, onError, onComplete })
 */
export async function chatSSE(params, { onMessage, onError, onComplete } = {}) {
  const url = `${API_BASE}/chat`;
  let controller = new AbortController();
  let completed = false;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      credentials: 'include',
      signal: controller.signal,
    });
    if (!res.ok || !res.body) {
      throw new Error('SSE 连接失败');
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split(/\r?\n/);
      buffer = lines.pop(); // 剩余未处理部分
      for (let line of lines) {
        if (!line.trim()) continue;
        // 处理特殊包
        if (line.startsWith('[ERROR]')) {
          if (onError) onError(line.slice(7));
          if (onMessage) onMessage(line.slice(7), { isError: true });
          completed = true;
          if (onComplete) onComplete();
          controller.abort();
          return () => controller.abort();
        }
        if (line.startsWith('[TOPIC]')) {
          if (onMessage) onMessage(line.slice(7), { isTopic: true });
          continue;
        }
        if (line === '[DONE]') {
          completed = true;
          if (onComplete) onComplete();
          controller.abort();
          return () => controller.abort();
        }
        if (onMessage) onMessage(line, {});
      }
    }
    if (!completed && onComplete) onComplete();
  } catch (err) {
    if (!completed && onError) onError(err);
    if (!completed && onComplete) onComplete();
  }
  return () => controller.abort();
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
