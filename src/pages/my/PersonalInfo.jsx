import React, { useContext, useState } from 'react';
import { ListMenu } from '../../components/ListMenu';
import { UserContext } from '../../store/UserContext';
import defaultAvatar from '../../assets/user.png';
import { Toast, Button, Modal, Input, Switch, Segmented, Dialog } from 'antd-mobile';

import { useNavigate } from 'react-router-dom';
import SubLayout from '../../layouts/SubLayout';

// 字段分组配置
const baseFields = [
  {
    key: 'avatar',
    label: '头像',
    type: 'avatar',
    render: (user) => (
      <img
        src={user.avatar || defaultAvatar}
        alt="avatar"
        style={{ width: 48, height: 48, borderRadius: '50%' }}
      />
    ),
    onClick: () => Toast.show({ content: '暂不支持头像修改', position: 'bottom' }),
    editable: false,
  },
  // type 可扩展为 'input' | 'segmented' | 'switch' | 'multi-select' | 'date' | 'verify' 等
  { key: 'nickname', label: '昵称', editable: true, type: 'input' },
  { key: 'gender', label: '性别', editable: true, type: 'segmented', options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '保密', value: 'unknown' },
  ] },
  { key: 'public_email', label: '公开邮箱', editable: true, type: 'input',
    // type: 'verify' 可用于邮箱验证，verify: true 预留
    verify: true },
  { key: 'status', label: '状态', editable: false },
  { key: 'roles', label: '角色', editable: false, render: (user) => (Array.isArray(user.roles) ? user.roles.join('、') : user.roles) },
  { key: 'created_at', label: '注册时间', editable: false },
];

const volunteerFields = [
  { key: 'public_email', label: '公开邮箱', editable: true, type: 'input', verify: true }, // type: 'verify' 可扩展
  { key: 'is_public_visible', label: '是否公开', editable: true, type: 'switch' },
  { key: 'skills', label: '擅长领域', editable: true, type: 'input' }, // type: 'multi-select' 可扩展
  { key: 'service_hours', label: '服务时长', editable: false },
  { key: 'work_status', label: '服务状态', editable: true, type: 'segmented', options: [
    { label: '在线', value: 'online' },
    { label: '忙碌', value: 'busy' },
    { label: '离线', value: 'offline' },
  ] },
  { key: 'status', label: '审核状态', editable: false },
];

const expertFields = [
  { key: 'public_email', label: '公开邮箱', editable: true, type: 'input', verify: true }, // type: 'verify' 可扩展
  { key: 'is_public_visible', label: '是否公开', editable: true, type: 'switch' },
  { key: 'title', label: '头衔', editable: true, type: 'input' },
  { key: 'organization', label: '组织', editable: true, type: 'input' },
  { key: 'specialties', label: '擅长领域', editable: true, type: 'input' },
  { key: 'status', label: '审核状态', editable: false },
];

import { updateUserProfile } from '../../api/auth';


function PersonalInfo() {
  const { user, refreshUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [editField, setEditField] = useState(null); // { field, value, group }
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <SubLayout title="个人信息">
        <div style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>请先登录</div>
          <Button color="primary" onClick={() => navigate('/auth/login')}>登录</Button>
        </div>
      </SubLayout>
    );
  }

  // 判断扩展信息分组（兼容 roles 为字符串或数组，便于后续扩展更多身份）
  const rolesArr = Array.isArray(user.roles)
    ? user.roles
    : typeof user.roles === 'string'
      ? [user.roles]
      : [];
  const isVolunteer = rolesArr.includes('volunteer');
  const isExpert = rolesArr.includes('expert');

  // 动态分组渲染，便于后续扩展更多身份类型
  const groups = [
    {
      title: '基础信息',
      fields: baseFields,
      data: user,
      groupKey: 'user',
    },
    // 可扩展更多分组
    ...(isVolunteer && user.volunteer_profile
      ? [{
          title: '志愿者信息',
          fields: volunteerFields,
          data: user.volunteer_profile,
          groupKey: 'volunteer_profile',
        }]
      : []),
    ...(isExpert && user.expert_profile
      ? [{
          title: '专家信息',
          fields: expertFields,
          data: user.expert_profile,
          groupKey: 'expert_profile',
        }]
      : []),
    // 预留：如有更多身份类型，可在此扩展
  ];

  // 处理字段点击
  const handleFieldClick = (field, value, group) => {
    if (field.key === 'avatar') {
      Toast.show({ content: '暂不支持头像修改', position: 'bottom' });
      return;
    }
    if (!field.editable) return;
    setEditField({ ...field, group });
    setEditValue(value);
  };

  // 弹窗保存
  const handleSave = async () => {
    if (!editField) return;
    setLoading(true);
    try {
      // 构造 payload
      let payload = {};
      if (editField.group.groupKey === 'user') {
        payload[editField.key] = editValue;
      } else {
        payload[editField.group.groupKey] = {
          ...editField.group.data,
          [editField.key]: editValue,
        };
      }
      await updateUserProfile(payload);
      Toast.show({ content: '保存成功', position: 'bottom' });
      setEditField(null);
      setEditValue('');
      if (typeof refreshUser === 'function') refreshUser();
    } catch {
      Toast.show({ content: '保存失败', position: 'bottom' });
    } finally {
      setLoading(false);
    }
  };

  // 弹窗渲染控件
  const renderEditInput = () => {
    if (!editField) return null;
    switch (editField.type) {
      case 'input':
        return (
          <Input
            value={editValue}
            onChange={val => setEditValue(val)}
            placeholder={`请输入${editField.label}`}
          />
        );
      case 'segmented':
        if (editField.options) {
          return (
            <Segmented
              options={editField.options}
              value={editValue}
              onChange={setEditValue}
            />
          );
        }
        break;
      case 'switch':
        return (
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <Switch checked={!!editValue} onChange={val => setEditValue(val)} />
          </div>
        );
      // 预留：多选控件
      case 'multi-select':
        // TODO: 后续支持多选控件
        return (
          <div style={{ color: '#ccc', textAlign: 'center', padding: '16px' }}>
            暂未支持多选类型
          </div>
        );
      // 预留：日期控件
      case 'date':
        // TODO: 后续支持日期控件
        return (
          <div style={{ color: '#ccc', textAlign: 'center', padding: '16px' }}>
            暂未支持日期类型
          </div>
        );
      // 预留：邮箱验证控件
      case 'verify':
        // TODO: 后续支持邮箱验证控件
        return (
          <div style={{ color: '#ccc', textAlign: 'center', padding: '16px' }}>
            暂未支持邮箱验证类型
          </div>
        );
      default:
        return (
          <div style={{ color: '#ccc', textAlign: 'center', padding: '16px' }}>
            暂不支持该字段类型
          </div>
        );
    }
  };

  return (
    <SubLayout title="个人信息">
      <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
        {groups.map((group) => (
          <div key={group.title} style={{ margin: '16px 0' }}>
            <div style={{ fontWeight: 600, fontSize: 16, padding: '8px 16px' }}>{group.title}</div>
            <ListMenu
              items={group.fields.map((field) => ({
                key: field.key,
                label: field.label,
                value: field.render ? field.render(group.data) : (group.data[field.key] ?? '-'),
                arrow: field.key === 'avatar' ? false : field.editable,
                onClick: field.key === 'avatar'
                  ? () => Dialog.alert({ content: '暂不支持头像修改' })
                  : () => handleFieldClick(field, group.data[field.key], group),
              }))}
                align="split"
            />
          </div>
        ))}
        <Modal
          visible={!!editField}
          content={renderEditInput()}
          title={editField?.label}
          closeOnMaskClick={!loading}
          onClose={() => !loading && setEditField(null)}
          actions={[
            {
              key: 'confirm',
              text: '确认',
              disabled: loading,
              onClick: handleSave,
            },
          ]}
          style={{
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)'
          }}
        />
      </div>
    </SubLayout>
  );
}

export default PersonalInfo;
