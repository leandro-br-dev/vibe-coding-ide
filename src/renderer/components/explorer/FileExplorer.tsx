import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const FileExplorer: React.FC = () => {
  const { currentProject, files } = useSelector((state: RootState) => state.project);

  if (!currentProject) {
    return (
      <div className="file-explorer">
        <div className="empty-state">
          <p>No folder opened</p>
          <button className="btn btn-primary">Open Folder</button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <span className="folder-name">{currentProject.name}</span>
      </div>

      <div className="file-tree">
        {files.length === 0 ? (
          <div className="empty-state">
            <p>No files in project</p>
          </div>
        ) : (
          <div className="file-list">
            {files.map((file: any) => (
              <div key={file.path} className="file-item">
                <span className="file-icon">{file.type === 'directory' ? '📁' : '📄'}</span>
                <span className="file-name">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
