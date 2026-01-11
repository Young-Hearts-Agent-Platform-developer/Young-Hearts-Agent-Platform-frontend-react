import React from 'react';
import styles from './TicketsPreview.module.css';

interface Ticket {
  id: string;
  title: string;
  summary: string;
  time: string;
  status: 'success' | 'pending' | 'closed';
}

interface TicketsPreviewProps {
  tickets: Ticket[];
}

const statusColor = {
  success: '#50E3C2',
  pending: '#F5A623',
  closed: '#CBD5E1',
};

const TicketsPreview: React.FC<TicketsPreviewProps> = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className={styles.emptyCard}>
        <div className={styles.emptyIcon}>📄</div>
        <div className={styles.emptyText}>暂无历史工单</div>
        <button className={styles.createBtn}>发起工单</button>
      </div>
    );
  }
  return (
    <div className={styles.list}>
      {tickets.slice(0, 3).map((ticket) => (
        <div className={styles.card} key={ticket.id}>
          <div className={styles.statusBar} style={{ background: statusColor[ticket.status] }} />
          <div className={styles.content}>
            <div className={styles.title}>{ticket.title}</div>
            <div className={styles.summary}>{ticket.summary}</div>
            <div className={styles.time}>{ticket.time}</div>
          </div>
        </div>
      ))}
      <div className={styles.viewAll}>查看全部</div>
    </div>
  );
};

export default TicketsPreview;
