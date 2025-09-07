import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { closeFile, setActiveFile } from '../../store/slices/editorSlice';
import { getFileIcon } from '../../utils/fileIcons';
import './EditorTabs.css';

export const EditorTabs: React.FC = () => {
  const dispatch = useDispatch();
  const { openFiles, activeFile } = useSelector((state: RootState) => state.editor);

  const handleTabClick = (filePath: string) => {
    dispatch(setActiveFile(filePath));
  };

  const handleTabClose = (e: React.MouseEvent, filePath: string) => {
    e.stopPropagation();
    dispatch(closeFile(filePath));
  };

  const getFileName = (filePath: string) => {
    return filePath.split(/[/\\]/).pop() || filePath;
  };

  if (openFiles.length === 0) {
    return null;
  }

  return (
    <div className="editor-tabs">
      <div className="tabs-container">
        {openFiles.map((file) => (
          <div
            key={file.filePath}
            className={`editor-tab ${activeFile === file.filePath ? 'active' : ''} ${file.isDirty ? 'dirty' : ''}`}
            onClick={() => handleTabClick(file.filePath)}
            title={file.filePath}
          >
            <span className="tab-icon">
              {getFileIcon(getFileName(file.filePath), false)}
            </span>
            
            <span className="tab-name">
              {getFileName(file.filePath)}
            </span>
            
            {file.isDirty && (
              <span className="dirty-indicator" title="Unsaved changes">
                ●
              </span>
            )}
            
            <button
              className="tab-close"
              onClick={(e) => handleTabClose(e, file.filePath)}
              title="Close"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="tabs-actions">
        <button 
          className="btn btn-icon"
          title="Close all tabs"
          onClick={() => openFiles.forEach(file => dispatch(closeFile(file.filePath)))}
        >
          ⊗
        </button>
      </div>
    </div>
  );
};