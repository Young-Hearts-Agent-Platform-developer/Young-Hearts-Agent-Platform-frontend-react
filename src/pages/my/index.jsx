

import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';
import SectionContainer from '../../components/SectionContainer';
import ListMenu from '../../components/ListMenu';
import LogoutButton from './LogoutButton';
import { ClockCircleOutline, StarOutline, SetOutline } from 'antd-mobile-icons';

const MyPage = () => {
  const navigate = useNavigate();
  // 顶部个人信息卡（空白占位）
  const infoCard = (
    <SectionContainer className="my-info-card">
      {/* 个人信息卡内容占位，无需实现 */}
    </SectionContainer>
  );

  // 功能列表分组配置
  const menuItems = [
    [
      {
        icon: <ClockCircleOutline style={{ fontSize: 22 }} />, title: '历史记录', desc: '浏览与操作历史', onClick: () => {} },
      {
        icon: <StarOutline style={{ fontSize: 22 }} />, title: '收藏知识库条目', desc: '我的收藏', onClick: () => {} },
    ],
    [
      {
        icon: <SetOutline style={{ fontSize: 22 }} />, title: '设置', desc: '账号与偏好设置', onClick: () => {} },
    ],
  ];

  // 中间功能列表
  const functionList = (
    <SectionContainer className="my-function-list">
      <ListMenu items={menuItems} />
    </SectionContainer>
  );

  // 底部登出按钮占位
  const logoutBtn = <LogoutButton />;

  return (
    <HomeLayout
      title="个人中心"
      activeKey="my"
      onTabChange={key => {
        if (key === 'home') navigate('/home');
        if (key === 'my') navigate('/my');
      }}
    >
      <div className="my-page-root">
        {infoCard}
        {functionList}
        {logoutBtn}
      </div>
    </HomeLayout>
  );
};

export default MyPage;
