import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_CHANNELS, IPCResponse } from '../../shared/types/ipc';
import { FileSystemHandler } from './fileSystemHandler';
import { ProjectHandler } from './projectHandler';
import { AgentHandler } from './agentHandler';
import { SettingsHandler } from './settingsHandler';
import { Logger } from '../logger';

const logger = Logger.getInstance();

// Handler registry
const handlers = {
  fileSystem: new FileSystemHandler(),
  project: new ProjectHandler(),
  agent: new AgentHandler(),
  settings: new SettingsHandler(),
};

// Generic wrapper for IPC handlers
const createHandler = <T, R>(handler: (event: IpcMainInvokeEvent, data: T) => Promise<R> | R) => {
  return async (event: IpcMainInvokeEvent, data: T): Promise<IPCResponse<R>> => {
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = Date.now();

    try {
      logger.debug(`IPC Request [${requestId}]:`, { data });

      const result = await handler(event, data);

      const response: IPCResponse<R> = {
        id: requestId,
        timestamp,
        success: true,
        data: result,
      };

      logger.debug(`IPC Response [${requestId}]:`, response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      logger.error(`IPC Error [${requestId}]:`, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        data,
      });

      const response: IPCResponse<R> = {
        id: requestId,
        timestamp,
        success: false,
        error: errorMessage,
      };

      return response;
    }
  };
};

// Register all IPC handlers
export const registerIPCHandlers = (): void => {
  // File System handlers
  ipcMain.handle(
    IPC_CHANNELS.FS_READ_FILE,
    createHandler(handlers.fileSystem.readFile.bind(handlers.fileSystem))
  );

  ipcMain.handle(
    IPC_CHANNELS.FS_WRITE_FILE,
    createHandler(handlers.fileSystem.writeFile.bind(handlers.fileSystem))
  );

  ipcMain.handle(
    IPC_CHANNELS.FS_READ_DIR,
    createHandler(handlers.fileSystem.readDirectory.bind(handlers.fileSystem))
  );

  // Project handlers
  ipcMain.handle(
    IPC_CHANNELS.PROJECT_OPEN,
    createHandler(handlers.project.openProject.bind(handlers.project))
  );

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_CLOSE,
    createHandler(handlers.project.closeProject.bind(handlers.project))
  );

  ipcMain.handle(
    IPC_CHANNELS.PROJECT_GET_INFO,
    createHandler(handlers.project.getProjectInfo.bind(handlers.project))
  );

  // Agent handlers
  ipcMain.handle(
    IPC_CHANNELS.AGENT_SEND,
    createHandler(handlers.agent.sendToAgent.bind(handlers.agent))
  );

  // Settings handlers
  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_GET,
    createHandler(handlers.settings.getSetting.bind(handlers.settings))
  );

  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_SET,
    createHandler(handlers.settings.setSetting.bind(handlers.settings))
  );

  ipcMain.handle(
    IPC_CHANNELS.SETTINGS_RESET,
    createHandler(handlers.settings.resetSettings.bind(handlers.settings))
  );

  logger.info('IPC handlers registered successfully');
};

// Initialize handlers on import
registerIPCHandlers();
