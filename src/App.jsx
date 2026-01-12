import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/home/index.jsx'));
const ConsultationPage = lazy(() => import('./pages/consultation/index.jsx'));
const KnowledgePage = lazy(() => import('./pages/knowledge/index.jsx'));
const CommunityPage = lazy(() => import('./pages/community/index.jsx'));

function NotFound() {
  return <div style={{ padding: 32, textAlign: 'center' }}>404 Not Found</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>页面加载中...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
