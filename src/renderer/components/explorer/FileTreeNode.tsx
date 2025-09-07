import React, { memo } from 'react';
import { getFileIcon } from '../../utils/fileIcons';
import type { FileInfo } from '../../store/slices/projectSlice';

interface FileTreeNodeProps {
  file: FileInfo;
  level: number;
  isSelected: boolean;
  isExpanded: boolean;
  onToggle: (path: string) => void;
  onSelect: (path: string, isMultiSelect: boolean) => void;
  onContextMenu: (e: React.MouseEvent, path: string, type: 'file' | 'directory') => void;
}

export const FileTreeNode: React.FC<FileTreeNodeProps> = memo(({
  file,
  level,
  isSelected,
  isExpanded,
  onToggle,
  onSelect,
  onContextMenu
}) => {
  const [dragOver, setDragOver] = React.useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (file.type === 'directory') {
      onToggle(file.path);
    }
    
    onSelect(file.path, e.ctrlKey || e.metaKey);
  };

  const handleDoubleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (file.type === 'file') {
      try {
        // Load file content and open in editor
        const content = await window.electronAPI?.readFile({
          filePath: file.path,
          encoding: 'utf8'
        });
        
        if (content !== undefined) {
          // Dispatch action to open file in editor
          const event = new CustomEvent('openFileInEditor', {
            detail: { filePath: file.path, content }
          });
          window.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Failed to open file:', error);
      }
    } else {
      onToggle(file.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    onContextMenu(e, file.path, file.type);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', file.path);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (file.type === 'directory') {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (file.type === 'directory') {
      const sourcePath = e.dataTransfer.getData('text/plain');
      if (sourcePath && sourcePath !== file.path) {
        // TODO: Implement file move operation
        console.log('Move file from', sourcePath, 'to', file.path);
      }
    }
  };

  const indentStyle = {
    paddingLeft: `${level * 20 + 8}px`
  };

  return (
    <>
      <div
        className={`file-tree-node ${isSelected ? 'selected' : ''} ${file.type === 'directory' ? 'directory' : 'file'} ${dragOver ? 'drag-over' : ''}`}
        style={indentStyle}
        draggable
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title={file.path}
      >
        {file.type === 'directory' && (
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        
        <span className="file-icon">
          {getFileIcon(file.name, file.type === 'directory')}
        </span>
        
        <span className="file-name">
          {file.name}
        </span>
        
        {file.type === 'file' && file.size !== undefined && (
          <span className="file-size">
            {formatFileSize(file.size)}
          </span>
        )}
      </div>
      
      {file.type === 'directory' && isExpanded && file.children && (
        <>
          {file.children.map((child) => (
            <FileTreeNode
              key={child.path}
              file={child}
              level={level + 1}
              isSelected={isSelected && child.path === file.path}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
            />
          ))}
        </>
      )}
    </>
  );
});

FileTreeNode.displayName = 'FileTreeNode';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}