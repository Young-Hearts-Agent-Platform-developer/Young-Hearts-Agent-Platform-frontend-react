import React from 'react';
import styles from './AccountActions.module.css';
import { SwapOutlined, SafetyOutlined, LogoutOutlined, RightOutlined } from '@ant-design/icons';

const actions = [
  { icon: <SwapOutlined />, text: '切换角色', danger: false },
  { icon: <SafetyOutlined />, text: '安全设置', danger: false },
  { icon: <LogoutOutlined />, text: '退出登录', danger: true },
];

const AccountActions: React.FC = () => {
  return (
    <div className={styles.list}>
      {actions.map((item, idx) => (
        <div
          className={styles.item + (item.danger ? ' ' + styles.danger : '')}
          key={item.text}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.text}>{item.text}</span>
          <RightOutlined className={styles.arrow} />
        </div>
      ))}
    </div>
  );
};

export default AccountActions;
