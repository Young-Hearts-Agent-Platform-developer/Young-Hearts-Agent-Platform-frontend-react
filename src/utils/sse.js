// 健壮的 SSE 工具类，支持事件监听、断开、错误捕获、连接状态管理
// 用法示例：
// const sse = new SSE(url, { onMessage, onError, onOpen, onClose });

class SSE {
  constructor(url, {
    onMessage = () => {},
    onError = () => {},
    onOpen = () => {},
    onClose = () => {},
    withCredentials = false,
    headers = {},
  } = {}) {
    this.url = url;
    this.onMessage = onMessage;
    this.onError = onError;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.withCredentials = withCredentials;
    this.headers = headers;
    this.eventSource = null;
    this.isConnected = false;
    this._init();
  }

  _init() {
    // 兼容自定义 header（如需可用 fetch+ReadableStream polyfill）
    if (Object.keys(this.headers).length > 0) {
      // 浏览器原生 EventSource 不支持自定义 header
      // 可扩展为 polyfill 方案
      console.warn('EventSource 不支持自定义 header，已忽略');
    }
    this.eventSource = new window.EventSource(this.url, { withCredentials: this.withCredentials });
    this.eventSource.onopen = (e) => {
      this.isConnected = true;
      this.onOpen(e);
    };
    this.eventSource.onmessage = (e) => {
      this.onMessage(e.data, e);
    };
    this.eventSource.onerror = (e) => {
      this.isConnected = false;
      this.onError(e);
      // readyState 2 = CLOSED
      if (this.eventSource.readyState === 2) {
        this.close();
      }
    };
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.isConnected = false;
      this.onClose();
    }
  }

  get readyState() {
    return this.eventSource ? this.eventSource.readyState : 2; // 2 = CLOSED
  }
}

export default SSE;
