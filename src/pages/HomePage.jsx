import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Top Part: Logo Section */}
      <div className="top-area">
        <div className="logo-section">
          <div className="logo">
            {/* Placeholder for Logo - 48x48 */}
            <div className="logo-icon-placeholder"></div> 
            <h1 className="logo-text">心青年</h1>
          </div>
          <p className="subtitle">智能体平台</p>
        </div>
      </div>

      {/* Bottom Part: Entry Cards Area */}
      <div className="bottom-area">
        {/* Main Entry Card */}
        <div 
          className="main-card" 
          onClick={() => navigate('/consultation')}
          role="button"
          tabIndex={0}
        >
          <div className="card-content">
            <div className="card-icon-placeholder"></div>
            <h2>智能体咨询</h2>
            <p>快速启动智能体对话，获取帮助。</p>
          </div>
          <div className="card-action">
            <button className="cta-button">开始咨询</button>
          </div>
        </div>

        {/* Sub Entry Cards */}
        <div className="sub-cards-container">
          <div 
            className="sub-card" 
            onClick={() => navigate('/knowledge')}
            role="button"
            tabIndex={0}
          >
            <div className="sub-card-info">
              <h3>查资料</h3>
              <p>快速查找知识库内容。</p>
            </div>
            <div className="sub-icon-placeholder"></div>
          </div>

          <div 
            className="sub-card" 
            onClick={() => navigate('/community')}
            role="button"
            tabIndex={0}
          >
           <div className="sub-card-info">
              <h3>找帮手</h3>
              <p>联系志愿者或专家。</p>
            </div>
            <div className="sub-icon-placeholder"></div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-item active" onClick={() => navigate('/')}>
            <span className="nav-icon-placeholder"></span>
            <span>首页</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/profile')}>
            <span className="nav-icon-placeholder"></span>
            <span>个人中心</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;