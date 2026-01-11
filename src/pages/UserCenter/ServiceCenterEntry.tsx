import React from 'react';
import styles from './ServiceCenterEntry.module.css';
import { UserOutlined } from '@ant-design/icons';

const ServiceCenterEntry: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>
        <UserOutlined style={{ fontSize: 36, color: '#fff' }} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>统一服务中心</div>
        <div className={styles.desc}>志愿者/专家/管理员专属入口</div>
      </div>
    </div>
  );
};

export default ServiceCenterEntry;
