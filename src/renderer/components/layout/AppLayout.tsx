import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { TabBar } from './TabBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarVisible, statusBarVisible, sidebarWidth } = useSelector(
    (state: RootState) => state.ui
  );

  return (
    <div className="app-layout">
      <Header />

      <div className="app-body">
        {sidebarVisible && <Sidebar width={sidebarWidth} />}

        <div className="app-main" style={{ marginLeft: sidebarVisible ? sidebarWidth : 0 }}>
          <TabBar />
          <div className="app-content">{children}</div>
        </div>
      </div>

      {statusBarVisible && <StatusBar />}
    </div>
  );
};
