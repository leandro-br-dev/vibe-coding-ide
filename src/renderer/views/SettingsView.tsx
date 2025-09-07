import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div className="settings-view">
      <div className="settings-content">
        <h1>Settings</h1>
        <div className="settings-categories">
          <div className="settings-category">
            <h2>Editor</h2>
            <p>Configure your coding environment</p>
          </div>
          <div className="settings-category">
            <h2>Theme</h2>
            <p>Customize the appearance</p>
          </div>
          <div className="settings-category">
            <h2>AI Agents</h2>
            <p>Configure your AI assistants</p>
          </div>
        </div>
      </div>
    </div>
  );
};
