
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';
import appIcon from '../../assets/app_icon.png';
import Card from '../../components/Card';
import SectionContainer from '../../components/SectionContainer';
import { MessageOutline, BillOutline, TeamOutline } from 'antd-mobile-icons';

export default function HomePage() {
  const navigate = useNavigate();

  // 键盘可达处理
  const handleKeyDown = (e, path) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(path);
    }
  };

  // Phase 5: 示例状态（实际可用 props/context/请求结果等替换）
  // 这里只做结构与注释预留
  const [loading] = useState(false); // 示例：实际可用请求状态
  const [error] = useState(false);
  const [empty] = useState(false);

  return (
    <HomeLayout
      title="首页"
      activeKey="home"
      onTabChange={key => {
        if (key === 'home') navigate('/home');
        if (key === 'my') navigate('/my');
      }}
    >
      <div className="home-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        {/* Phase 5: 占位区结构预留，实际可根据业务条件渲染 */}
        {/* 加载态占位区 */}
        {loading && (
          <div className="loading-placeholder" aria-busy="true" aria-live="polite">
            {/* 可替换为实际 Spinner 组件 */}
            <span className="spinner" aria-hidden="true" /> 加载中...
          </div>
        )}
        {/* 错误态占位区 */}
        {error && (
          <div className="error-placeholder" role="alert">
            出错了，请重试
          </div>
        )}
        {/* 空态占位区 */}
        {empty && (
          <div className="empty-state-placeholder" aria-live="polite">
            暂无内容
          </div>
        )}

        {/* 上半部分：logo区+主副标题，仅在内容区居中展示 */}
        <div className="home-logo-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 48, marginBottom: 32 }}>
          <img src={appIcon} alt="logo" className="home-logo-img" style={{ width: 72, height: 72, marginBottom: 16, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }} />
          <div className="home-title" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--color-primary)' }}>心青年智能体平台</div>
          <div className="home-subtitle" style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>陪伴·成长·互助</div>
        </div>
        {/* 下半部分：主副入口卡片区（SectionContainer 包裹 Card 组件组合） */}
        <SectionContainer title="功能入口" className="home-card-section" >
          <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card
              type="main"
              icon={<MessageOutline />}
              title="智能体咨询"
              subtitle="与AI智能体对话，获得陪伴与建议"
              // className="main-card"
              aria-label="智能体咨询"
              tabIndex={0}
              onClick={() => navigate('/consultation')}
              onKeyDown={e => handleKeyDown(e, '/consultation')}
            />
            <div className="sub-entry-cards" style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Card
                  type="sub"
                  icon={<BillOutline />}
                  title="查资料"
                  subtitle="心理知识库"
                  aria-label="查资料"
                  tabIndex={0}
                  onClick={() => navigate('/knowledge')}
                  onKeyDown={e => handleKeyDown(e, '/knowledge')}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Card
                  type="sub"
                  icon={<TeamOutline />}
                  title="找帮手"
                  subtitle="互助社区"
                  aria-label="找帮手"
                  tabIndex={0}
                  onClick={() => navigate('/community')}
                  onKeyDown={e => handleKeyDown(e, '/community')}
                />
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    </HomeLayout>
  );
}
