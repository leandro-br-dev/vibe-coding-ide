import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
  formatOnSave: boolean;
  formatOnType: boolean;
  bracketPairColorization: boolean;
}

interface ThemeSettings {
  theme: 'light' | 'dark' | 'auto';
  editorTheme: string;
  customThemes: Array<{
    id: string;
    name: string;
    colors: Record<string, string>;
  }>;
}

interface LanguageSettings {
  defaultLanguage: string;
  languageAssociations: Record<string, string>; // file extension -> language
  formatterConfig: Record<string, any>;
  linterConfig: Record<string, any>;
}

interface AgentSettings {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  requestTimeout: number;
  retryAttempts: number;
  enableTelemetry: boolean;
  budgetLimit: number;
  budgetPeriod: 'daily' | 'weekly' | 'monthly';
}

interface GitSettings {
  userName: string;
  userEmail: string;
  defaultBranch: string;
  autoFetch: boolean;
  fetchInterval: number;
  signCommits: boolean;
}

interface TerminalSettings {
  shell: string;
  fontSize: number;
  fontFamily: string;
  cursorStyle: 'block' | 'line' | 'underline';
  cursorBlink: boolean;
  scrollback: number;
}

interface GeneralSettings {
  language: string;
  startupBehavior: 'welcome' | 'last-project' | 'empty-editor';
  checkForUpdates: boolean;
  telemetryEnabled: boolean;
  crashReporting: boolean;
  backupEnabled: boolean;
  backupInterval: number;
}

export interface SettingsState {
  editor: EditorSettings;
  theme: ThemeSettings;
  language: LanguageSettings;
  agent: AgentSettings;
  git: GitSettings;
  terminal: TerminalSettings;
  general: GeneralSettings;

  // Settings management
  isModified: boolean;
  lastSaved: number;
  version: number;
}

const initialState: SettingsState = {
  editor: {
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    lineHeight: 1.5,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: false,
    lineNumbers: true,
    minimap: true,
    autoSave: true,
    autoSaveDelay: 1000,
    formatOnSave: true,
    formatOnType: false,
    bracketPairColorization: true,
  },
  theme: {
    theme: 'auto',
    editorTheme: 'vs-dark',
    customThemes: [],
  },
  language: {
    defaultLanguage: 'plaintext',
    languageAssociations: {
      '.ts': 'typescript',
      '.tsx': 'typescriptreact',
      '.js': 'javascript',
      '.jsx': 'javascriptreact',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.cs': 'csharp',
      '.json': 'json',
      '.md': 'markdown',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.yaml': 'yaml',
      '.yml': 'yaml',
    },
    formatterConfig: {},
    linterConfig: {},
  },
  agent: {
    defaultModel: 'gpt-4',
    temperature: 0.3,
    maxTokens: 2000,
    requestTimeout: 30000,
    retryAttempts: 3,
    enableTelemetry: true,
    budgetLimit: 50,
    budgetPeriod: 'monthly',
  },
  git: {
    userName: '',
    userEmail: '',
    defaultBranch: 'main',
    autoFetch: true,
    fetchInterval: 300000, // 5 minutes
    signCommits: false,
  },
  terminal: {
    shell: process.platform === 'win32' ? 'powershell.exe' : '/bin/bash',
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    cursorStyle: 'block',
    cursorBlink: true,
    scrollback: 1000,
  },
  general: {
    language: 'en',
    startupBehavior: 'welcome',
    checkForUpdates: true,
    telemetryEnabled: true,
    crashReporting: true,
    backupEnabled: true,
    backupInterval: 300000, // 5 minutes
  },

  // Settings management
  isModified: false,
  lastSaved: Date.now(),
  version: 1,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Editor settings
    updateEditorSettings: (state, action: PayloadAction<Partial<EditorSettings>>) => {
      state.editor = { ...state.editor, ...action.payload };
      state.isModified = true;
    },

    // Theme settings
    updateThemeSettings: (state, action: PayloadAction<Partial<ThemeSettings>>) => {
      state.theme = { ...state.theme, ...action.payload };
      state.isModified = true;
    },
    addCustomTheme: (state, action: PayloadAction<ThemeSettings['customThemes'][0]>) => {
      state.theme.customThemes.push(action.payload);
      state.isModified = true;
    },
    removeCustomTheme: (state, action: PayloadAction<string>) => {
      state.theme.customThemes = state.theme.customThemes.filter(
        theme => theme.id !== action.payload
      );
      state.isModified = true;
    },

    // Language settings
    updateLanguageSettings: (state, action: PayloadAction<Partial<LanguageSettings>>) => {
      state.language = { ...state.language, ...action.payload };
      state.isModified = true;
    },
    setLanguageAssociation: (
      state,
      action: PayloadAction<{ extension: string; language: string }>
    ) => {
      state.language.languageAssociations[action.payload.extension] = action.payload.language;
      state.isModified = true;
    },

    // Agent settings
    updateAgentSettings: (state, action: PayloadAction<Partial<AgentSettings>>) => {
      state.agent = { ...state.agent, ...action.payload };
      state.isModified = true;
    },

    // Git settings
    updateGitSettings: (state, action: PayloadAction<Partial<GitSettings>>) => {
      state.git = { ...state.git, ...action.payload };
      state.isModified = true;
    },

    // Terminal settings
    updateTerminalSettings: (state, action: PayloadAction<Partial<TerminalSettings>>) => {
      state.terminal = { ...state.terminal, ...action.payload };
      state.isModified = true;
    },

    // General settings
    updateGeneralSettings: (state, action: PayloadAction<Partial<GeneralSettings>>) => {
      state.general = { ...state.general, ...action.payload };
      state.isModified = true;
    },

    // Settings management
    markSettingsSaved: state => {
      state.isModified = false;
      state.lastSaved = Date.now();
    },
    resetToDefaults: state => {
      return { ...initialState, version: state.version + 1 };
    },
    importSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return {
        ...state,
        ...action.payload,
        isModified: true,
        version: state.version + 1,
      };
    },
    incrementVersion: state => {
      state.version += 1;
    },
  },
});

export const {
  updateEditorSettings,
  updateThemeSettings,
  addCustomTheme,
  removeCustomTheme,
  updateLanguageSettings,
  setLanguageAssociation,
  updateAgentSettings,
  updateGitSettings,
  updateTerminalSettings,
  updateGeneralSettings,
  markSettingsSaved,
  resetToDefaults,
  importSettings,
  incrementVersion,
} = settingsSlice.actions;
