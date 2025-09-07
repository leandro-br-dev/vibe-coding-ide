import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveView } from '../store/slices/uiSlice';

export const WelcomeView: React.FC = () => {
  const dispatch = useDispatch();

  const handleOpenSettings = () => {
    dispatch(setActiveView('settings'));
  };

  const handleNewProject = () => {
    // TODO: Implement project creation
    console.log('New project creation - to be implemented');
  };

  const handleOpenFolder = () => {
    // TODO: Implement folder opening
    console.log('Open folder - to be implemented');
  };

  return (
    <div className="welcome-view">
      <div className="welcome-content">
        <h1>Welcome to Vibe Coding IDE</h1>
        <p>Your AI-powered development environment</p>

        <div className="welcome-stats">
          <div className="stat-item">
            <div className="stat-value">v0.1.0</div>
            <div className="stat-label">Version</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Phase 1.3</div>
            <div className="stat-label">Development Stage</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Ready</div>
            <div className="stat-label">Status</div>
          </div>
        </div>

        <div className="welcome-actions">
          <div className="action-card">
            <h3>🚀 Start Coding</h3>
            <p>Open a project or create a new file to begin your coding journey</p>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={handleOpenFolder}>
                Open Folder
              </button>
              <button className="btn btn-secondary" onClick={handleNewProject}>
                New Project
              </button>
            </div>
          </div>

          <div className="action-card">
            <h3>📂 Recent Projects</h3>
            <p>Continue working on your recent projects</p>
            <div className="recent-projects-list">
              <div className="empty-state">
                <p>No recent projects yet</p>
                <small>Open a folder to get started</small>
              </div>
            </div>
          </div>

          <div className="action-card">
            <h3>🤖 AI Agents</h3>
            <p>Configure your AI coding assistants for enhanced productivity</p>
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={handleOpenSettings}>
                Configure Agents
              </button>
            </div>
            <div className="agent-preview">
              <small>Available: Frontend • Backend • Testing • Documentation</small>
            </div>
          </div>

          <div className="action-card">
            <h3>⚙️ Development</h3>
            <p>Current implementation status and features</p>
            <div className="feature-list">
              <div className="feature-item completed">✅ React Setup</div>
              <div className="feature-item completed">✅ Redux State</div>
              <div className="feature-item completed">✅ Theme System</div>
              <div className="feature-item completed">✅ Layout Components</div>
              <div className="feature-item pending">🚧 File Explorer (Phase 2.1)</div>
              <div className="feature-item pending">🚧 Monaco Editor (Phase 2.2)</div>
            </div>
          </div>
        </div>

        <div className="welcome-footer">
          <p>
            Vibe Coding IDE • Built with Electron, React, and TypeScript
          </p>
          <p>
            <small>Phase 1.3 - Renderer Process Base Implementation Complete</small>
          </p>
        </div>
      </div>
    </div>
  );
};
