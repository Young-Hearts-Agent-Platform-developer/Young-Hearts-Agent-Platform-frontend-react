// 个人中心主页面
// 依赖：Ant Design、Vant Icons、TypeScript
// 如未安装依赖，请先执行：
// npm install antd @vant/icons

import React from 'react';
import styles from './index.module.css';
import { SettingOutlined } from '@ant-design/icons';
// Vant icons 替换为 Ant Design Icons
import { UserOutlined, EditOutlined, RobotOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';

// 组件拆分
import ProfileHeader from './ProfileHeader';
import QuickEntranceGrid from './QuickEntranceGrid';
import TicketsPreview from './TicketsPreview';
import ServiceCenterEntry from './ServiceCenterEntry';
import AccountActions from './AccountActions';

const UserCenter: React.FC = () => {
  // TODO: 用户信息、角色、工单等数据应通过 hooks/API 获取
  const user = {
    avatar: '',
    nickname: '心青年家属',
    role: 'Family', // Support/Family
    tags: ['家属'],
  };
  const tickets: any[] = [];
  const isSupport = user.role === 'Support';

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>个人中心</div>
        <button className={styles.headerAction} aria-label="设置">
          <SettingOutlined style={{ fontSize: 20 }} />
        </button>
      </header>

      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* 快捷功能区 */}
      <QuickEntranceGrid />

      {/* 历史工单预览 */}
      <TicketsPreview tickets={tickets} />

      {/* 统一服务中心入口（仅 Support） */}
      {isSupport && <ServiceCenterEntry />}

      {/* 账号动作与安全 */}
      <AccountActions />

      {/* Bottom Tab */}
      <nav className={styles.bottomTab}>
        <div className={styles.tabItem + ' ' + styles.active}>首页</div>
        <div className={styles.tabItem}>个人中心</div>
      </nav>
    </div>
  );
};

export default UserCenter;
