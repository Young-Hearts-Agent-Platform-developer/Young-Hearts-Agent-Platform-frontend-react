import React from 'react';
import { useParams } from 'react-router-dom';

export default function ReviewDetailPage() {
  const { id } = useParams();
  return (
    <div style={{ padding: 20 }}>
      <h2>审核详情及操作页 (占位)</h2>
      <p>当前审核条目 ID: {id}</p>
      <p>仅 Expert 和 Admin 角色可访问。</p>
    </div>
  );
}
