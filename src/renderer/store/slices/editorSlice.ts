import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OpenFile {
  filePath: string;
  content: string;
  language: string;
  isDirty: boolean;
  isReadOnly: boolean;
  encoding: string;
}

export interface EditorState {
  // Open files and tabs
  openFiles: OpenFile[];
  activeFile: string | null;
  recentFiles: string[];

  // Editor settings
  theme: 'light' | 'dark';
  fontSize: number;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: boolean;
  showMinimap: boolean;
  showLineNumbers: boolean;
  autoSave: boolean;
  autoSaveDelay: number;

  // Editor features
  enableIntelliSense: boolean;
  enableCodeLens: boolean;
  enableBracketMatching: boolean;
  enableFolding: boolean;
  enableFind: boolean;
  enableReplace: boolean;

  // Language-specific settings
  languageSettings: Record<string, any>;

  // Search and replace
  searchQuery: string;
  searchOptions: {
    caseSensitive: boolean;
    wholeWord: boolean;
    regex: boolean;
  };
}

const initialState: EditorState = {
  // Open files and tabs
  openFiles: [],
  activeFile: null,
  recentFiles: [],

  // Editor settings
  theme: 'light',
  fontSize: 14,
  tabSize: 2,
  insertSpaces: true,
  wordWrap: false,
  showMinimap: true,
  showLineNumbers: true,
  autoSave: true,
  autoSaveDelay: 2000,

  // Editor features
  enableIntelliSense: true,
  enableCodeLens: true,
  enableBracketMatching: true,
  enableFolding: true,
  enableFind: true,
  enableReplace: true,

  // Language-specific settings
  languageSettings: {},

  // Search and replace
  searchQuery: '',
  searchOptions: {
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  },
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // File management
    openFile: (state, action: PayloadAction<{ filePath: string; content: string; language?: string }>) => {
      const { filePath, content, language } = action.payload;
      
      // Check if file is already open
      const existingFile = state.openFiles.find(file => file.filePath === filePath);
      if (existingFile) {
        state.activeFile = filePath;
        return;
      }

      // Detect language from file extension if not provided
      const detectedLanguage = language || detectLanguageFromPath(filePath);

      const newFile: OpenFile = {
        filePath,
        content,
        language: detectedLanguage,
        isDirty: false,
        isReadOnly: false,
        encoding: 'utf8'
      };

      state.openFiles.push(newFile);
      state.activeFile = filePath;
      
      // Add to recent files
      state.recentFiles = [filePath, ...state.recentFiles.filter(path => path !== filePath)].slice(0, 10);
    },

    closeFile: (state, action: PayloadAction<string>) => {
      const filePath = action.payload;
      
      state.openFiles = state.openFiles.filter(file => file.filePath !== filePath);
      
      // If closing active file, switch to next available or clear
      if (state.activeFile === filePath) {
        state.activeFile = state.openFiles.length > 0 ? state.openFiles[0].filePath : null;
      }
    },

    closeAllFiles: (state) => {
      state.openFiles = [];
      state.activeFile = null;
    },

    setActiveFile: (state, action: PayloadAction<string>) => {
      const filePath = action.payload;
      const file = state.openFiles.find(file => file.filePath === filePath);
      if (file) {
        state.activeFile = filePath;
      }
    },

    updateFileContent: (state, action: PayloadAction<{ filePath: string; content: string; isDirty: boolean }>) => {
      const { filePath, content, isDirty } = action.payload;
      const file = state.openFiles.find(file => file.filePath === filePath);
      if (file) {
        file.content = content;
        file.isDirty = isDirty;
      }
    },

    saveFile: (state, action: PayloadAction<string>) => {
      const filePath = action.payload;
      const file = state.openFiles.find(file => file.filePath === filePath);
      if (file) {
        file.isDirty = false;
      }
    },

    saveAllFiles: (state) => {
      state.openFiles.forEach(file => {
        file.isDirty = false;
      });
    },

    // Editor settings
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },

    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = Math.max(8, Math.min(72, action.payload));
    },

    setTabSize: (state, action: PayloadAction<number>) => {
      state.tabSize = Math.max(1, Math.min(8, action.payload));
    },

    toggleWordWrap: (state) => {
      state.wordWrap = !state.wordWrap;
    },

    toggleMinimap: (state) => {
      state.showMinimap = !state.showMinimap;
    },

    toggleLineNumbers: (state) => {
      state.showLineNumbers = !state.showLineNumbers;
    },

    setAutoSave: (state, action: PayloadAction<boolean>) => {
      state.autoSave = action.payload;
    },

    setAutoSaveDelay: (state, action: PayloadAction<number>) => {
      state.autoSaveDelay = Math.max(500, Math.min(10000, action.payload));
    },

    // Editor features
    toggleIntelliSense: (state) => {
      state.enableIntelliSense = !state.enableIntelliSense;
    },

    toggleCodeLens: (state) => {
      state.enableCodeLens = !state.enableCodeLens;
    },

    toggleBracketMatching: (state) => {
      state.enableBracketMatching = !state.enableBracketMatching;
    },

    toggleFolding: (state) => {
      state.enableFolding = !state.enableFolding;
    },

    // Language settings
    setLanguageSettings: (state, action: PayloadAction<{ language: string; settings: any }>) => {
      const { language, settings } = action.payload;
      state.languageSettings[language] = settings;
    },

    // Search and replace
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setSearchOptions: (state, action: PayloadAction<Partial<EditorState['searchOptions']>>) => {
      state.searchOptions = { ...state.searchOptions, ...action.payload };
    },

    // Recent files
    addToRecentFiles: (state, action: PayloadAction<string>) => {
      const filePath = action.payload;
      state.recentFiles = [filePath, ...state.recentFiles.filter(path => path !== filePath)].slice(0, 10);
    },

    clearRecentFiles: (state) => {
      state.recentFiles = [];
    },
  },
});

// Helper function to detect language from file path
function detectLanguageFromPath(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'rb': 'ruby',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'shell',
    'bat': 'bat',
    'dockerfile': 'dockerfile',
  };

  return languageMap[extension || ''] || 'plaintext';
}

export const {
  openFile,
  closeFile,
  closeAllFiles,
  setActiveFile,
  updateFileContent,
  saveFile,
  saveAllFiles,
  setTheme,
  setFontSize,
  setTabSize,
  toggleWordWrap,
  toggleMinimap,
  toggleLineNumbers,
  setAutoSave,
  setAutoSaveDelay,
  toggleIntelliSense,
  toggleCodeLens,
  toggleBracketMatching,
  toggleFolding,
  setLanguageSettings,
  setSearchQuery,
  setSearchOptions,
  addToRecentFiles,
  clearRecentFiles,
} = editorSlice.actions;

export default editorSlice.reducer;