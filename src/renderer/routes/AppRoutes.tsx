import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EditorView } from '../views/EditorView';
import { SettingsView } from '../views/SettingsView';
import { WelcomeView } from '../views/WelcomeView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<WelcomeView />} />
      <Route path="/editor" element={<EditorView />} />
      <Route path="/settings" element={<SettingsView />} />
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};
