import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar, toggleAiChat } from '../../store/slices/uiSlice';
import { useTheme } from '../../contexts/ThemeContext';

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { currentProject } = useSelector((state: RootState) => state.project);

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="header-btn"
          onClick={() => dispatch(toggleSidebar())}
          title="Toggle Sidebar"
        >
          <span className="icon">☰</span>
        </button>

        <div className="app-title">
          <span className="logo">Vibe IDE</span>
          {currentProject && <span className="project-name"> - {currentProject.name}</span>}
        </div>
      </div>

      <div className="header-center">{/* Center content can be added here */}</div>

      <div className="header-right">
        <button
          className="header-btn"
          onClick={() => dispatch(toggleAiChat())}
          title="Toggle AI Chat"
        >
          <span className="icon">🤖</span>
        </button>

        <button
          className="header-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <span className="icon">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </div>
    </header>
  );
};
