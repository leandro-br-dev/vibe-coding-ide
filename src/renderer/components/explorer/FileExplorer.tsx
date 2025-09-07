import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentProject, setFiles, toggleFolder, setSelectedFiles, updateFileTree } from '../../store/slices/projectSlice';
import type { FileInfo } from '../../store/slices/projectSlice';
import { FileTreeNode } from './FileTreeNode';
import { FileContextMenu } from './FileContextMenu';
import './FileExplorer.css';

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  targetPath?: string | undefined;
  targetType?: 'file' | 'directory' | undefined;
}

export const FileExplorer: React.FC = () => {
  const dispatch = useDispatch();
  const { currentProject, files, expandedFolders, selectedFiles, searchQuery } = useSelector((state: RootState) => state.project);
  
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0
  });
  const [searchResults, setSearchResults] = useState<FileInfo[]>([]);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('');

  // Handle folder opening
  const handleOpenFolder = useCallback(async () => {
    try {
      if (!window.electronAPI) {
        console.error('ElectronAPI not available');
        return;
      }
      
      const result = await window.electronAPI.openProject({ projectPath: '' });
      
      if (result) {
        const projectInfo = {
          ...result,
          type: result.type as 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'go' | 'rust' | 'other' || 'other'
        };
        dispatch(setCurrentProject(projectInfo));
        // Load files after project is set
        loadProjectFiles(result.path);
      }
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  }, [dispatch]);

  // Load project files
  const loadProjectFiles = useCallback(async (projectPath: string) => {
    try {
      const fileList = await window.electronAPI?.readDirectory({ 
        dirPath: projectPath,
        recursive: false 
      });
      if (fileList) {
        const treeData = buildFileTree(fileList);
        dispatch(setFiles(treeData));
      }
    } catch (error) {
      console.error('Failed to load project files:', error);
    }
  }, [dispatch]);

  // Build hierarchical file tree from flat file list
  const buildFileTree = (fileList: any[]): FileInfo[] => {
    const tree: FileInfo[] = [];
    const pathMap = new Map<string, FileInfo>();

    // Sort files: directories first, then files, both alphabetically
    const sortedFiles = [...fileList].sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const file of sortedFiles) {
      const fileInfo: FileInfo = {
        name: file.name,
        path: file.path,
        type: file.isDirectory ? 'directory' : 'file',
        size: file.size,
        modified: file.modified ? new Date(file.modified).getTime() : undefined,
        isExpanded: false
      };
      
      if (file.isDirectory) {
        fileInfo.children = [];
      }

      pathMap.set(file.path, fileInfo);
      tree.push(fileInfo);
    }

    return tree;
  };

  // Handle folder toggle
  const handleFolderToggle = useCallback(async (folderPath: string) => {
    dispatch(toggleFolder(folderPath));
    
    // Load children if expanding
    if (!expandedFolders.includes(folderPath)) {
      try {
        const children = await window.electronAPI?.readDirectory({ 
          dirPath: folderPath,
          recursive: false 
        });
        if (children) {
          const treeData = buildFileTree(children);
          dispatch(updateFileTree({ path: folderPath, children: treeData }));
        }
      } catch (error) {
        console.error('Failed to load folder contents:', error);
      }
    }
  }, [dispatch, expandedFolders]);

  // Handle file selection
  const handleFileSelect = useCallback((filePath: string, isMultiSelect: boolean = false) => {
    let newSelection: string[];
    
    if (isMultiSelect) {
      newSelection = selectedFiles.includes(filePath)
        ? selectedFiles.filter(path => path !== filePath)
        : [...selectedFiles, filePath];
    } else {
      newSelection = [filePath];
    }
    
    dispatch(setSelectedFiles(newSelection));
  }, [dispatch, selectedFiles]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, filePath?: string, fileType?: 'file' | 'directory') => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetPath: filePath,
      targetType: fileType
    });
  }, []);

  // Hide context menu
  const hideContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Filter files based on search query and file type
  useEffect(() => {
    let filteredFiles = files;

    // Apply search filter
    if (searchQuery) {
      const searchInTree = (nodes: FileInfo[]): FileInfo[] => {
        const results: FileInfo[] = [];
        
        for (const node of nodes) {
          if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push(node);
          }
          
          if (node.children) {
            const childResults = searchInTree(node.children);
            results.push(...childResults);
          }
        }
        
        return results;
      };

      filteredFiles = searchInTree(files);
    }

    // Apply file type filter
    if (fileTypeFilter && filteredFiles.length > 0) {
      const filterByType = (nodes: FileInfo[]): FileInfo[] => {
        return nodes.filter(node => {
          if (node.type === 'directory') return true;
          
          const extension = node.name.split('.').pop()?.toLowerCase();
          if (fileTypeFilter === 'code') {
            return ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 'go', 'rs', 'php', 'rb'].includes(extension || '');
          } else if (fileTypeFilter === 'images') {
            return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(extension || '');
          } else if (fileTypeFilter === 'documents') {
            return ['md', 'txt', 'pdf', 'doc', 'docx', 'html'].includes(extension || '');
          } else {
            return extension === fileTypeFilter;
          }
        });
      };

      filteredFiles = filterByType(filteredFiles);
    }

    setSearchResults(filteredFiles);
  }, [searchQuery, fileTypeFilter, files]);

  // Click outside to hide context menu
  useEffect(() => {
    const handleClick = () => hideContextMenu();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [hideContextMenu]);

  if (!currentProject) {
    return (
      <div className="file-explorer">
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <p>No folder opened</p>
          <button className="btn btn-primary" onClick={handleOpenFolder}>
            Open Folder
          </button>
        </div>
      </div>
    );
  }

  const displayFiles = searchQuery ? searchResults : files;

  return (
    <div className="file-explorer" onContextMenu={e => handleContextMenu(e)}>
      <div className="explorer-header">
        <div className="folder-info">
          <span className="folder-icon">📁</span>
          <span className="folder-name" title={currentProject.path}>
            {currentProject.name}
          </span>
        </div>
        <div className="explorer-actions">
          <select 
            value={fileTypeFilter} 
            onChange={(e) => setFileTypeFilter(e.target.value)}
            className="filter-select"
            title="Filter by file type"
          >
            <option value="">All Files</option>
            <option value="code">Code Files</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
            <option value="js">JavaScript</option>
            <option value="ts">TypeScript</option>
            <option value="py">Python</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
          </select>
          <button 
            className="btn btn-icon" 
            title="Refresh"
            onClick={() => loadProjectFiles(currentProject.path)}
          >
            🔄
          </button>
        </div>
      </div>

      <div className="file-tree">
        {displayFiles.length === 0 ? (
          <div className="empty-state">
            <p>{searchQuery ? 'No files match your search' : 'No files in project'}</p>
          </div>
        ) : (
          <div className="file-list">
            {displayFiles.map((file) => (
              <FileTreeNode
                key={file.path}
                file={file}
                level={0}
                isSelected={selectedFiles.includes(file.path)}
                isExpanded={expandedFolders.includes(file.path)}
                onToggle={handleFolderToggle}
                onSelect={handleFileSelect}
                onContextMenu={handleContextMenu}
              />
            ))}
          </div>
        )}
      </div>

      {contextMenu.visible && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetPath={contextMenu.targetPath}
          targetType={contextMenu.targetType}
          onClose={hideContextMenu}
        />
      )}
    </div>
  );
};
