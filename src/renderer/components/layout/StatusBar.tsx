import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const StatusBar: React.FC = () => {
  const { currentProject } = useSelector((state: RootState) => state.project);
  const { activeTabId, tabs } = useSelector((state: RootState) => state.ui);
  const { usage } = useSelector((state: RootState) => state.agents);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="status-bar">
      <div className="status-left">
        {currentProject && (
          <div className="status-item">
            <span className="icon">📁</span>
            <span>{currentProject.name}</span>
          </div>
        )}

        {activeTab && (
          <div className="status-item">
            <span className="icon">📄</span>
            <span>{activeTab.title}</span>
            {activeTab.isDirty && <span className="dirty-indicator">●</span>}
          </div>
        )}
      </div>

      <div className="status-center">{/* Center content */}</div>

      <div className="status-right">
        <div className="status-item">
          <span className="icon">🤖</span>
          <span>${usage.totalCost.toFixed(2)}</span>
        </div>

        <div className="status-item">
          <span className="icon">⚡</span>
          <span>{usage.totalTokens.toLocaleString()}</span>
        </div>

        <div className="status-item">
          <span className="icon">🔧</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};
