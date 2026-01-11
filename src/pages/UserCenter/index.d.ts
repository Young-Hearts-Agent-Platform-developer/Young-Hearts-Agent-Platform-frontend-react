export interface User {
  avatar: string;
  nickname: string;
  role: string;
  tags: string[];
}

export interface Ticket {
  id: string;
  title: string;
  summary: string;
  time: string;
  status: 'success' | 'pending' | 'closed';
}
