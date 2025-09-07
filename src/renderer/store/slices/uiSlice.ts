import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Tab {
  id: string;
  title: string;
  filePath: string;
  isDirty: boolean;
  isActive: boolean;
}

export interface UiState {
  // Layout state
  sidebarVisible: boolean;
  sidebarWidth: number;
  statusBarVisible: boolean;
  terminalVisible: boolean;
  terminalHeight: number;

  // Navigation
  activeView: 'welcome' | 'editor' | 'settings';

  // Editor tabs
  tabs: Tab[];
  activeTabId: string | null;

  // Panels
  explorerVisible: boolean;
  aiChatVisible: boolean;
  aiChatWidth: number;

  // Modal states
  settingsModalOpen: boolean;
  aboutModalOpen: boolean;

  // Loading states
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: UiState = {
  // Layout state
  sidebarVisible: true,
  sidebarWidth: 250,
  statusBarVisible: true,
  terminalVisible: false,
  terminalHeight: 200,

  // Navigation
  activeView: 'welcome',

  // Editor tabs
  tabs: [],
  activeTabId: null,

  // Panels
  explorerVisible: true,
  aiChatVisible: false,
  aiChatWidth: 350,

  // Modal states
  settingsModalOpen: false,
  aboutModalOpen: false,

  // Loading states
  isLoading: false,
  loadingMessage: '',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Layout actions
    toggleSidebar: state => {
      state.sidebarVisible = !state.sidebarVisible;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = Math.max(200, Math.min(400, action.payload));
    },
    toggleStatusBar: state => {
      state.statusBarVisible = !state.statusBarVisible;
    },
    toggleTerminal: state => {
      state.terminalVisible = !state.terminalVisible;
    },
    setTerminalHeight: (state, action: PayloadAction<number>) => {
      state.terminalHeight = Math.max(100, Math.min(600, action.payload));
    },

    // Navigation actions
    setActiveView: (state, action: PayloadAction<'welcome' | 'editor' | 'settings'>) => {
      state.activeView = action.payload;
    },

    // Tab actions
    addTab: (state, action: PayloadAction<Omit<Tab, 'isActive'>>) => {
      // Close existing tab if same file
      state.tabs = state.tabs.filter(tab => tab.filePath !== action.payload.filePath);

      // Set all tabs inactive
      state.tabs.forEach(tab => {
        tab.isActive = false;
      });

      // Add new tab
      const newTab = { ...action.payload, isActive: true };
      state.tabs.push(newTab);
      state.activeTabId = newTab.id;
    },
    closeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
      if (tabIndex === -1) return;

      const wasActive = state.tabs[tabIndex] ? state.tabs[tabIndex].isActive : false;
      state.tabs.splice(tabIndex, 1);

      if (wasActive && state.tabs.length > 0) {
        // Activate next tab or previous if it was the last
        const nextIndex = tabIndex < state.tabs.length ? tabIndex : tabIndex - 1;
        if (state.tabs[nextIndex]) {
          state.tabs[nextIndex].isActive = true;
          state.activeTabId = state.tabs[nextIndex].id;
        }
      } else if (state.tabs.length === 0) {
        state.activeTabId = null;
        state.activeView = 'welcome';
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.tabs.forEach(tab => {
        tab.isActive = tab.id === action.payload;
      });
      state.activeTabId = action.payload;
    },
    updateTabDirty: (state, action: PayloadAction<{ id: string; isDirty: boolean }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        tab.isDirty = action.payload.isDirty;
      }
    },

    // Panel actions
    toggleExplorer: state => {
      state.explorerVisible = !state.explorerVisible;
    },
    toggleAiChat: state => {
      state.aiChatVisible = !state.aiChatVisible;
    },
    setAiChatWidth: (state, action: PayloadAction<number>) => {
      state.aiChatWidth = Math.max(300, Math.min(600, action.payload));
    },

    // Modal actions
    openSettingsModal: state => {
      state.settingsModalOpen = true;
    },
    closeSettingsModal: state => {
      state.settingsModalOpen = false;
    },
    openAboutModal: state => {
      state.aboutModalOpen = true;
    },
    closeAboutModal: state => {
      state.aboutModalOpen = false;
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
    },
  },
});

export const {
  toggleSidebar,
  setSidebarWidth,
  toggleStatusBar,
  toggleTerminal,
  setTerminalHeight,
  setActiveView,
  addTab,
  closeTab,
  setActiveTab,
  updateTabDirty,
  toggleExplorer,
  toggleAiChat,
  setAiChatWidth,
  openSettingsModal,
  closeSettingsModal,
  openAboutModal,
  closeAboutModal,
  setLoading,
} = uiSlice.actions;
