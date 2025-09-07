import React from 'react';
import { EditorContainer } from '../components/editor/EditorContainer';
import './EditorView.css';

export const EditorView: React.FC = () => {
  return (
    <div className="editor-view">
      <EditorContainer />
    </div>
  );
};
