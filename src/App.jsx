import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './store/UserContext';

const HomePage = lazy(() => import('./pages/home/index.jsx'));
const ConsultationPage = lazy(() => import('./pages/consultation/index.jsx'));
const KnowledgePage = lazy(() => import('./pages/knowledge/index.jsx'));
const CommunityPage = lazy(() => import('./pages/community/index.jsx'));
const PersonalInfoPage = lazy(() => import('./pages/my/PersonalInfo.jsx'));

const LoginPage = lazy(() => import('./pages/auth/login.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/register.jsx'));
const MyPage = lazy(() => import('./pages/my/index.jsx'));

function NotFound() {
  return <div style={{ padding: 32, textAlign: 'center' }}>404 Not Found</div>;
}

function App() {
  // 组件挂载后打印环境变量
  useEffect(() => {
    // 打印所有暴露的环境变量（最直观）
    console.log('📝 所有环境变量：', import.meta.env);
    
    // 打印指定的自定义变量（按需查看）
    console.log('🔑 项目标题：', import.meta.env.VITE_APP_TITLE);
    console.log('🔑 API地址：', import.meta.env.VITE_API_BASE_URL);
    
    // 打印Vite内置环境变量（辅助验证环境）
    console.log('🔧 当前环境模式：', import.meta.env.MODE); // development/production
    console.log('🔧 是否为开发环境：', import.meta.env.DEV); // true/false
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
        <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>页面加载中...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/my/personal-info" element={<PersonalInfoPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
