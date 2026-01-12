import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import '../styles/variables.css';

/**
 * 次级页面布局组件
 * 顶部为 Header（带返回），无底部导航，主内容区为 children
 */
const SubLayout = ({ title, subtitle, rightActions, children, onBack }) => {
  return (
    <div className="yh-sub-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        title={title}
        subtitle={subtitle}
        showBack
        rightActions={rightActions}
        back={onBack}
      />
      <main style={{ flex: 1, width: '100%' }}>{children}</main>
    </div>
  );
};

SubLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  rightActions: PropTypes.node,
  children: PropTypes.node,
  onBack: PropTypes.func,
};

export default SubLayout;
