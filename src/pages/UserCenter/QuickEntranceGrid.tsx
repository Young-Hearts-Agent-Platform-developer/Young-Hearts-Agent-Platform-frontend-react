import React from 'react';
import styles from './QuickEntranceGrid.module.css';
import { RobotOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';

const QuickEntranceGrid: React.FC = () => {
  return (
    <div className={styles.grid}>
      {/* 主卡：智能体咨询 */}
      <div className={styles.mainCard}>
        <div className={styles.iconWrap}>
          <RobotOutlined style={{ fontSize: 48, color: '#fff' }} />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.mainTitle}>智能体咨询</div>
          <div className={styles.mainDesc}>点击开始对话</div>
        </div>
      </div>
      <div className={styles.subGrid}>
        {/* 小卡1：查资料 */}
        <div className={styles.subCard}>
          <BookOutlined style={{ fontSize: 28, color: '#4A90E2' }} />
          <div className={styles.subTitle}>查资料</div>
          <div className={styles.subDesc}>知识库检索</div>
        </div>
        {/* 小卡2：找帮手 */}
        <div className={styles.subCard}>
          <TeamOutlined style={{ fontSize: 28, color: '#4A90E2' }} />
          <div className={styles.subTitle}>找帮手</div>
          <div className={styles.subDesc}>专家/志愿者</div>
        </div>
      </div>
    </div>
  );
};

export default QuickEntranceGrid;
