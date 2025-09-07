import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  // File system operations
  readFile: (filePath: string): Promise<string> => ipcRenderer.invoke('fs:readFile', filePath),
  writeFile: (filePath: string, content: string): Promise<void> =>
    ipcRenderer.invoke('fs:writeFile', filePath, content),

  // Project operations
  openProject: (projectPath: string): Promise<void> =>
    ipcRenderer.invoke('project:open', projectPath),

  // Agent operations
  sendToAgent: (agentId: string, message: string): Promise<string> =>
    ipcRenderer.invoke('agent:send', agentId, message),

  // Event listeners
  onAgentResponse: (callback: (response: unknown) => void): void => {
    ipcRenderer.on('agent:response', (_, response) => callback(response));
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
