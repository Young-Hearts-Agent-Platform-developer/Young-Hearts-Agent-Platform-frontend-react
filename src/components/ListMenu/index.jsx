import React from 'react';
import './index.css';

// ListMenu props: items: Array<Array<MenuItem>>
// MenuItem: { icon: ReactNode, title: string, desc?: string, onClick?: function }
const ListMenu = ({ items = [] }) => {
  return (
    <div className="list-menu">
      {items.map((group, groupIdx) => (
        <div key={groupIdx} className="list-menu-group">
          {group.map((item, idx) => (
            <div
              key={idx}
              className="list-menu-item"
              onClick={item.onClick}
            >
              {item.icon && (
                <span className="list-menu-icon">{item.icon}</span>
              )}
              <div className="list-menu-content">
                <span className="list-menu-title">{item.title}</span>
                {item.desc && (
                  <span className="list-menu-desc">{item.desc}</span>
                )}
              </div>
              <span className="list-menu-arrow">&gt;</span>
            </div>
          ))}
          {/* 分组间隔，仅视觉分隔，无标题 */}
          {groupIdx !== items.length - 1 && (
            <div className="list-menu-divider" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ListMenu;
