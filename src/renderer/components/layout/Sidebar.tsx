import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FileExplorer } from '../explorer/FileExplorer';

interface SidebarProps {
  width: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  const { explorerVisible } = useSelector((state: RootState) => state.ui);

  return (
    <div className="sidebar" style={{ width }}>
      <div className="sidebar-header">
        <h3>Explorer</h3>
      </div>

      <div className="sidebar-content">{explorerVisible && <FileExplorer />}</div>
    </div>
  );
};
