import React, { useEffect, useRef } from 'react';

interface FileContextMenuProps {
  x: number;
  y: number;
  targetPath?: string | undefined;
  targetType?: 'file' | 'directory' | undefined;
  onClose: () => void;
}

interface MenuAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  separator?: boolean;
  disabled?: boolean;
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
  x,
  y,
  targetPath,
  targetType,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Position menu within viewport
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      
      let adjustedX = x;
      let adjustedY = y;
      
      // Check if menu goes beyond right edge
      if (x + rect.width > window.innerWidth) {
        adjustedX = x - rect.width;
      }
      
      // Check if menu goes beyond bottom edge
      if (y + rect.height > window.innerHeight) {
        adjustedY = y - rect.height;
      }
      
      menu.style.left = `${Math.max(0, adjustedX)}px`;
      menu.style.top = `${Math.max(0, adjustedY)}px`;
    }
  }, [x, y]);

  const handleNewFile = async () => {
    const fileName = prompt('Enter file name:');
    if (fileName && targetPath) {
      try {
        const filePath = `${targetType === 'directory' ? targetPath : targetPath.substring(0, targetPath.lastIndexOf('/'))}/${fileName}`;
        await window.electronAPI?.writeFile({
          filePath,
          content: ''
        });
        // TODO: Refresh file tree
        console.log('Created file:', filePath);
      } catch (error) {
        console.error('Failed to create file:', error);
        alert('Failed to create file');
      }
    }
    onClose();
  };

  const handleNewFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && targetPath) {
      try {
        const folderPath = `${targetType === 'directory' ? targetPath : targetPath.substring(0, targetPath.lastIndexOf('/'))}/${folderName}`;
        // Create folder by creating a temporary file and then removing it
        const tempFilePath = `${folderPath}/.gitkeep`;
        await window.electronAPI?.writeFile({
          filePath: tempFilePath,
          content: ''
        });
        // TODO: Refresh file tree
        console.log('Created folder:', folderPath);
      } catch (error) {
        console.error('Failed to create folder:', error);
        alert('Failed to create folder');
      }
    }
    onClose();
  };

  const handleRename = async () => {
    if (!targetPath) return;
    
    const currentName = targetPath.split('/').pop() || '';
    const newName = prompt('Enter new name:', currentName);
    
    if (newName && newName !== currentName) {
      try {
        // TODO: Implement rename functionality
        console.log('Rename:', targetPath, 'to', newName);
        alert('Rename functionality not yet implemented');
      } catch (error) {
        console.error('Failed to rename:', error);
        alert('Failed to rename');
      }
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!targetPath) return;
    
    const confirmDelete = confirm(`Are you sure you want to delete "${targetPath.split('/').pop()}"?`);
    
    if (confirmDelete) {
      try {
        // TODO: Implement delete functionality
        console.log('Delete:', targetPath);
        alert('Delete functionality not yet implemented');
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Failed to delete');
      }
    }
    onClose();
  };

  const handleCopy = () => {
    if (targetPath) {
      navigator.clipboard.writeText(targetPath);
      console.log('Copied path to clipboard:', targetPath);
    }
    onClose();
  };

  const handleRevealInExplorer = () => {
    if (targetPath) {
      // TODO: Implement reveal in file explorer
      console.log('Reveal in explorer:', targetPath);
      alert('Reveal in explorer functionality not yet implemented');
    }
    onClose();
  };

  const getMenuActions = (): MenuAction[] => {
    const actions: MenuAction[] = [];

    // New file/folder actions
    actions.push({
      id: 'new-file',
      label: 'New File',
      icon: '📄',
      action: handleNewFile
    });

    actions.push({
      id: 'new-folder',
      label: 'New Folder',
      icon: '📁',
      action: handleNewFolder
    });

    if (targetPath) {
      actions.push({
        id: 'separator-1',
        label: '',
        icon: '',
        action: () => {},
        separator: true
      });

      // File/folder specific actions
      actions.push({
        id: 'rename',
        label: 'Rename',
        icon: '✏️',
        action: handleRename
      });

      actions.push({
        id: 'delete',
        label: 'Delete',
        icon: '🗑️',
        action: handleDelete
      });

      actions.push({
        id: 'separator-2',
        label: '',
        icon: '',
        action: () => {},
        separator: true
      });

      actions.push({
        id: 'copy-path',
        label: 'Copy Path',
        icon: '📋',
        action: handleCopy
      });

      actions.push({
        id: 'reveal',
        label: 'Reveal in File Explorer',
        icon: '🔍',
        action: handleRevealInExplorer
      });
    }

    return actions;
  };

  const menuActions = getMenuActions();

  return (
    <div
      ref={menuRef}
      className="file-context-menu"
      onClick={e => e.stopPropagation()}
    >
      {menuActions.map((action) => (
        action.separator ? (
          <div key={action.id} className="menu-separator" />
        ) : (
          <div
            key={action.id}
            className={`menu-item ${action.disabled ? 'disabled' : ''}`}
            onClick={action.disabled ? undefined : action.action}
          >
            <span className="menu-icon">{action.icon}</span>
            <span className="menu-label">{action.label}</span>
          </div>
        )
      ))}
    </div>
  );
};