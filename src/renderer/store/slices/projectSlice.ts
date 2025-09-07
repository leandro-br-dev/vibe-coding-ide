import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: number;
  children?: FileInfo[];
  isExpanded?: boolean;
}

interface ProjectInfo {
  name: string;
  path: string;
  type: 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'go' | 'rust' | 'other';
  packageManager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'maven' | 'gradle';
  framework?: string;
  gitRepository?: string;
  branches?: string[];
  activeBranch?: string;
}

export interface ProjectState {
  // Current project
  currentProject: ProjectInfo | null;
  isProjectOpen: boolean;

  // File explorer
  files: FileInfo[];
  expandedFolders: Set<string>;
  selectedFiles: string[];

  // Recent projects
  recentProjects: ProjectInfo[];

  // File operations
  unsavedFiles: Map<string, string>; // filePath -> content
  fileWatchers: string[];

  // Git integration
  gitStatus: {
    staged: string[];
    unstaged: string[];
    untracked: string[];
    branch: string;
    hasChanges: boolean;
  } | null;

  // Search
  searchQuery: string;
  searchResults: Array<{
    file: string;
    line: number;
    column: number;
    match: string;
    context: string;
  }>;
}

const initialState: ProjectState = {
  // Current project
  currentProject: null,
  isProjectOpen: false,

  // File explorer
  files: [],
  expandedFolders: new Set(),
  selectedFiles: [],

  // Recent projects
  recentProjects: [],

  // File operations
  unsavedFiles: new Map(),
  fileWatchers: [],

  // Git integration
  gitStatus: null,

  // Search
  searchQuery: '',
  searchResults: [],
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Project actions
    setCurrentProject: (state, action: PayloadAction<ProjectInfo>) => {
      state.currentProject = action.payload;
      state.isProjectOpen = true;

      // Add to recent projects
      const existing = state.recentProjects.findIndex(p => p.path === action.payload.path);
      if (existing !== -1) {
        state.recentProjects.splice(existing, 1);
      }
      state.recentProjects.unshift(action.payload);

      // Keep only last 10 recent projects
      if (state.recentProjects.length > 10) {
        state.recentProjects = state.recentProjects.slice(0, 10);
      }
    },
    closeProject: state => {
      state.currentProject = null;
      state.isProjectOpen = false;
      state.files = [];
      state.expandedFolders.clear();
      state.selectedFiles = [];
      state.gitStatus = null;
    },

    // File explorer actions
    setFiles: (state, action: PayloadAction<FileInfo[]>) => {
      state.files = action.payload;
    },
    updateFileTree: (state, action: PayloadAction<{ path: string; children: FileInfo[] }>) => {
      const updateNode = (nodes: FileInfo[]): void => {
        for (const node of nodes) {
          if (node.path === action.payload.path && node.type === 'directory') {
            node.children = action.payload.children;
            return;
          }
          if (node.children) {
            updateNode(node.children);
          }
        }
      };
      updateNode(state.files);
    },
    toggleFolder: (state, action: PayloadAction<string>) => {
      if (state.expandedFolders.has(action.payload)) {
        state.expandedFolders.delete(action.payload);
      } else {
        state.expandedFolders.add(action.payload);
      }
    },
    setSelectedFiles: (state, action: PayloadAction<string[]>) => {
      state.selectedFiles = action.payload;
    },

    // File operations
    setUnsavedContent: (state, action: PayloadAction<{ filePath: string; content: string }>) => {
      state.unsavedFiles.set(action.payload.filePath, action.payload.content);
    },
    markFileSaved: (state, action: PayloadAction<string>) => {
      state.unsavedFiles.delete(action.payload);
    },
    addFileWatcher: (state, action: PayloadAction<string>) => {
      if (!state.fileWatchers.includes(action.payload)) {
        state.fileWatchers.push(action.payload);
      }
    },
    removeFileWatcher: (state, action: PayloadAction<string>) => {
      state.fileWatchers = state.fileWatchers.filter(path => path !== action.payload);
    },

    // Git actions
    setGitStatus: (state, action: PayloadAction<ProjectState['gitStatus']>) => {
      state.gitStatus = action.payload;
    },

    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<ProjectState['searchResults']>) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: state => {
      state.searchResults = [];
      state.searchQuery = '';
    },
  },
});

export const {
  setCurrentProject,
  closeProject,
  setFiles,
  updateFileTree,
  toggleFolder,
  setSelectedFiles,
  setUnsavedContent,
  markFileSaved,
  addFileWatcher,
  removeFileWatcher,
  setGitStatus,
  setSearchQuery,
  setSearchResults,
  clearSearchResults,
} = projectSlice.actions;
