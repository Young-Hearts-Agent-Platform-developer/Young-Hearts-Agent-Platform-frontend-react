import React from 'react';
import { useParams } from 'react-router-dom';

export default function KnowledgeDetailPage() {
  const { id } = useParams();
  return (
    <div style={{ padding: 20 }}>
      <h2>知识详情页 (占位)</h2>
      <p>当前知识 ID: {id}</p>
    </div>
  );
}
