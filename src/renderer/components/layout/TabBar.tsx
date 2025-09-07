import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setActiveTab, closeTab } from '../../store/slices/uiSlice';

export const TabBar: React.FC = () => {
  const dispatch = useDispatch();
  const { tabs } = useSelector((state: RootState) => state.ui);

  if (tabs.length === 0) {
    return null;
  }

  const handleTabClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    dispatch(closeTab(tabId));
  };

  return (
    <div className="tab-bar">
      <div className="tab-list">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.isActive ? 'active' : ''} ${tab.isDirty ? 'dirty' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tab-title">{tab.title}</span>
            {tab.isDirty && <span className="dirty-indicator">●</span>}
            <button className="tab-close" onClick={e => handleTabClose(e, tab.id)} title="Close">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
