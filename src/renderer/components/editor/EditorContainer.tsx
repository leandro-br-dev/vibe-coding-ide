import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { openFile, updateFileContent } from '../../store/slices/editorSlice';
import { EditorTabs } from './EditorTabs';
import { CodeEditor } from './CodeEditor';
import './EditorContainer.css';

export const EditorContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { openFiles, activeFile } = useSelector((state: RootState) => state.editor);
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  const activeFileData = openFiles.find(file => file.filePath === activeFile);

  // Listen for file open events from the file explorer
  useEffect(() => {
    const handleOpenFile = (event: CustomEvent<{ filePath: string; content: string }>) => {
      const { filePath, content } = event.detail;
      dispatch(openFile({ filePath, content }));
      setWelcomeVisible(false);
    };

    window.addEventListener('openFileInEditor' as any, handleOpenFile);
    
    return () => {
      window.removeEventListener('openFileInEditor' as any, handleOpenFile);
    };
  }, [dispatch]);

  // Hide welcome screen when files are opened
  useEffect(() => {
    if (openFiles.length > 0) {
      setWelcomeVisible(false);
    } else {
      setWelcomeVisible(true);
    }
  }, [openFiles.length]);

  const handleContentChange = (content: string | undefined) => {
    if (activeFile && content !== undefined) {
      dispatch(updateFileContent({
        filePath: activeFile,
        content,
        isDirty: true
      }));
    }
  };

  return (
    <div className="editor-container">
      {openFiles.length > 0 && <EditorTabs />}
      
      <div className="editor-content">
        {welcomeVisible && openFiles.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-logo">
                <span className="logo-icon">⚡</span>
                <h1>Vibe Coding IDE</h1>
              </div>
              
              <p className="welcome-subtitle">
                A modern, extensible code editor built with Electron and React
              </p>
              
              <div className="welcome-actions">
                <div className="action-group">
                  <h3>Start</h3>
                  <button className="action-btn" onClick={() => {
                    // Trigger folder open from file explorer
                    const event = new CustomEvent('triggerFolderOpen');
                    window.dispatchEvent(event);
                  }}>
                    📁 Open Folder
                  </button>
                  <button className="action-btn" onClick={() => {
                    // Create new file
                    const newFileName = `untitled-${Date.now()}.txt`;
                    dispatch(openFile({ 
                      filePath: newFileName, 
                      content: '',
                      language: 'plaintext'
                    }));
                  }}>
                    📄 New File
                  </button>
                </div>
                
                <div className="action-group">
                  <h3>Recent</h3>
                  <p className="empty-state">No recent files</p>
                </div>
              </div>
              
              <div className="welcome-shortcuts">
                <h3>Keyboard Shortcuts</h3>
                <div className="shortcuts-grid">
                  <div className="shortcut">
                    <span className="shortcut-key">Ctrl+O</span>
                    <span className="shortcut-desc">Open File</span>
                  </div>
                  <div className="shortcut">
                    <span className="shortcut-key">Ctrl+N</span>
                    <span className="shortcut-desc">New File</span>
                  </div>
                  <div className="shortcut">
                    <span className="shortcut-key">Ctrl+S</span>
                    <span className="shortcut-desc">Save File</span>
                  </div>
                  <div className="shortcut">
                    <span className="shortcut-key">Ctrl+F</span>
                    <span className="shortcut-desc">Find</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeFileData ? (
          <CodeEditor
            filePath={activeFileData.filePath}
            language={activeFileData.language}
            value={activeFileData.content}
            onChange={handleContentChange}
            readOnly={activeFileData.isReadOnly}
          />
        ) : openFiles.length > 0 ? (
          <div className="no-active-file">
            <p>Select a file from the tabs above to start editing</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};