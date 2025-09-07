import React from 'react';

export const EditorView: React.FC = () => {
  return (
    <div className="editor-view">
      <div className="editor-content">
        <div className="editor-placeholder">
          <h2>No file selected</h2>
          <p>Select a file from the explorer to start editing</p>
        </div>
      </div>
    </div>
  );
};
