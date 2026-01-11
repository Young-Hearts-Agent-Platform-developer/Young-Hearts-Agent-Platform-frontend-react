import React from 'react';
import styles from './ProfileHeader.module.css';
import { EditOutlined, UserOutlined } from '@ant-design/icons';

interface User {
  avatar: string;
  nickname: string;
  role: string;
  tags: string[];
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrap}>
        {user.avatar ? (
          <img src={user.avatar} alt="头像" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <UserOutlined className={styles.avatarIcon} />
          </div>
        )}
        <button className={styles.editBtn} aria-label="编辑资料">
          <EditOutlined style={{ fontSize: 20, color: '#4A90E2' }} />
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles.nickname}>{user.nickname}</div>
        <div className={styles.tags}>
          {user.tags.map((tag) => (
            <span className={styles.tag} key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
