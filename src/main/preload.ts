import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, IPCResponse } from '../shared/types/ipc';
import type {
  FileReadRequest,
  FileWriteRequest,
  DirectoryReadRequest,
  ProjectOpenRequest,
  AgentRequest,
  SettingsRequest,
  FileInfo,
  ProjectInfo,
  AgentResponse,
} from '../shared/types/ipc';

const electronAPI = {
  // File system operations
  readFile: async (request: FileReadRequest): Promise<string> => {
    const response: IPCResponse<string> = await ipcRenderer.invoke(
      IPC_CHANNELS.FS_READ_FILE,
      request
    );
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data!;
  },

  writeFile: async (request: FileWriteRequest): Promise<void> => {
    const response: IPCResponse<void> = await ipcRenderer.invoke(
      IPC_CHANNELS.FS_WRITE_FILE,
      request
    );
    if (!response.success) {
      throw new Error(response.error);
    }
  },

  readDirectory: async (request: DirectoryReadRequest): Promise<FileInfo[]> => {
    const response: IPCResponse<FileInfo[]> = await ipcRenderer.invoke(
      IPC_CHANNELS.FS_READ_DIR,
      request
    );
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data!;
  },

  // Project operations
  openProject: async (request: ProjectOpenRequest): Promise<ProjectInfo> => {
    const response: IPCResponse<ProjectInfo> = await ipcRenderer.invoke(
      IPC_CHANNELS.PROJECT_OPEN,
      request
    );
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data!;
  },

  closeProject: async (): Promise<void> => {
    const response: IPCResponse<void> = await ipcRenderer.invoke(IPC_CHANNELS.PROJECT_CLOSE);
    if (!response.success) {
      throw new Error(response.error);
    }
  },

  getProjectInfo: async (): Promise<ProjectInfo | null> => {
    const response: IPCResponse<ProjectInfo | null> = await ipcRenderer.invoke(
      IPC_CHANNELS.PROJECT_GET_INFO
    );
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data!;
  },

  // Agent operations
  sendToAgent: async (request: AgentRequest): Promise<AgentResponse> => {
    const response: IPCResponse<AgentResponse> = await ipcRenderer.invoke(
      IPC_CHANNELS.AGENT_SEND,
      request
    );
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data!;
  },

  // Settings operations
  getSetting: async (request: SettingsRequest): Promise<any> => {
    const response: IPCResponse<any> = await ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET, request);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  },

  setSetting: async (request: SettingsRequest): Promise<void> => {
    const response: IPCResponse<void> = await ipcRenderer.invoke(
      IPC_CHANNELS.SETTINGS_SET,
      request
    );
    if (!response.success) {
      throw new Error(response.error);
    }
  },

  resetSettings: async (): Promise<void> => {
    const response: IPCResponse<void> = await ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_RESET);
    if (!response.success) {
      throw new Error(response.error);
    }
  },

  // Event listeners
  onMenuAction: (callback: (action: string, data?: any) => void): (() => void) => {
    const handleMenuNewFile = () => callback('new-file');
    const handleMenuOpenFile = (_: any, filePath: string) => callback('open-file', filePath);
    const handleMenuOpenFolder = (_: any, folderPath: string) =>
      callback('open-folder', folderPath);
    const handleMenuSave = () => callback('save');
    const handleMenuSaveAs = () => callback('save-as');
    const handleMenuFind = () => callback('find');
    const handleMenuReplace = () => callback('replace');
    const handleMenuToggleExplorer = () => callback('toggle-explorer');
    const handleMenuToggleTerminal = () => callback('toggle-terminal');
    const handleMenuOpenAiChat = () => callback('open-ai-chat');
    const handleMenuAiSettings = () => callback('ai-settings');

    ipcRenderer.on('menu-new-file', handleMenuNewFile);
    ipcRenderer.on('menu-open-file', handleMenuOpenFile);
    ipcRenderer.on('menu-open-folder', handleMenuOpenFolder);
    ipcRenderer.on('menu-save', handleMenuSave);
    ipcRenderer.on('menu-save-as', handleMenuSaveAs);
    ipcRenderer.on('menu-find', handleMenuFind);
    ipcRenderer.on('menu-replace', handleMenuReplace);
    ipcRenderer.on('menu-toggle-explorer', handleMenuToggleExplorer);
    ipcRenderer.on('menu-toggle-terminal', handleMenuToggleTerminal);
    ipcRenderer.on('menu-open-ai-chat', handleMenuOpenAiChat);
    ipcRenderer.on('menu-ai-settings', handleMenuAiSettings);

    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('menu-new-file', handleMenuNewFile);
      ipcRenderer.removeListener('menu-open-file', handleMenuOpenFile);
      ipcRenderer.removeListener('menu-open-folder', handleMenuOpenFolder);
      ipcRenderer.removeListener('menu-save', handleMenuSave);
      ipcRenderer.removeListener('menu-save-as', handleMenuSaveAs);
      ipcRenderer.removeListener('menu-find', handleMenuFind);
      ipcRenderer.removeListener('menu-replace', handleMenuReplace);
      ipcRenderer.removeListener('menu-toggle-explorer', handleMenuToggleExplorer);
      ipcRenderer.removeListener('menu-toggle-terminal', handleMenuToggleTerminal);
      ipcRenderer.removeListener('menu-open-ai-chat', handleMenuOpenAiChat);
      ipcRenderer.removeListener('menu-ai-settings', handleMenuAiSettings);
    };
  },

  onAgentResponse: (callback: (response: AgentResponse) => void): (() => void) => {
    const handler = (_: any, response: AgentResponse) => callback(response);
    ipcRenderer.on(IPC_CHANNELS.AGENT_RESPONSE, handler);

    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.AGENT_RESPONSE, handler);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
