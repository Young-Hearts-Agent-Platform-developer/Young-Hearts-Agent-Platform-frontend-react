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
 *   - session_id: string，必须，当前会话唯一标识，前端 chat 页面通过 useParams() 获取
 *   - query: string，用户输入内容
 *   - role, reasoning_effort: 其他参数
 * @param {function} onMessage - 每段消息回调 (data, {isTopic, isError, isDone})
 * @param {function} onError - 错误回调 (error)
 * @param {function} onComplete - 完成回调 ()
 * @returns {Promise<function>} 返回关闭流的函数
 *
 * 用法：
 * chatSSE({ session_id, query, role, reasoning_effort }, { onMessage, onError, onComplete })
 */
// session_id 必须由前端页面通过 useParams() 获取并传递
export async function chatSSE(params, { onMessage, onError, onComplete } = {}) {
  const url = `${API_BASE}/chat`;
  let controller = new AbortController();
  let completed = false;
  // 单行处理逻辑提取为函数
  function handleLine(line) {
    if (!line.trim()) return false;
    if (line.startsWith('[ERROR]')) {
      if (onError) onError(line.slice(7));
      if (onMessage) onMessage(line.slice(7), { isError: true });
      completed = true;
      if (onComplete) onComplete();
      controller.abort();
      return true; // 终止
    }
    if (line.startsWith('[TOPIC]')) {
      if (onMessage) onMessage(line.slice(7), { isTopic: true });
      return false;
    }
    if (line === '[DONE]') {
      completed = true;
      if (onComplete) onComplete();
      controller.abort();
      return true; // 终止
    }
    if (onMessage) onMessage(line, {});
    return false;
  }
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
      // 保留换行符，按每个换行分帧，但不丢弃空行
      let lines = buffer.split(/(\r?\n)/);
      let temp = '';
      for (let i = 0; i < lines.length; i++) {
        temp += lines[i];
        if (lines[i] === '\n' || lines[i] === '\r\n') {
          if (handleLine(temp.replace(/\r?\n$/, ''))) return () => controller.abort();
          temp = '';
        }
      }
      buffer = temp;
    }
    // 处理流结束后buffer中残留内容
    if (buffer && !completed) {
      handleLine(buffer);
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
