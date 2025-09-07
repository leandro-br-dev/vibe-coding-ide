// IPC Channel definitions
export const IPC_CHANNELS = {
  // File System
  FS_READ_FILE: 'fs:readFile',
  FS_WRITE_FILE: 'fs:writeFile',
  FS_READ_DIR: 'fs:readDir',
  FS_WATCH_FILE: 'fs:watchFile',
  FS_UNWATCH_FILE: 'fs:unwatchFile',

  // Project Management
  PROJECT_OPEN: 'project:open',
  PROJECT_CLOSE: 'project:close',
  PROJECT_GET_INFO: 'project:getInfo',

  // Agent System
  AGENT_SEND: 'agent:send',
  AGENT_RESPONSE: 'agent:response',
  AGENT_ERROR: 'agent:error',
  AGENT_STATUS: 'agent:status',

  // Window Management
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',

  // Settings
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_RESET: 'settings:reset',

  // Log
  LOG_ERROR: 'log:error',
  LOG_WARN: 'log:warn',
  LOG_INFO: 'log:info',
  LOG_DEBUG: 'log:debug',
} as const;

// Type definitions for IPC messages
export interface IPCRequest<T = any> {
  id: string;
  timestamp: number;
  data: T;
}

export interface IPCResponse<T = any> {
  id: string;
  timestamp: number;
  success: boolean;
  data?: T;
  error?: string;
}

// File System Types
export interface FileReadRequest {
  filePath: string;
  encoding?: BufferEncoding;
}

export interface FileWriteRequest {
  filePath: string;
  content: string;
  encoding?: BufferEncoding;
}

export interface DirectoryReadRequest {
  dirPath: string;
  recursive?: boolean;
}

export interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modified: Date;
}

// Project Types
export interface ProjectOpenRequest {
  projectPath: string | '';
}

export interface ProjectInfo {
  name: string;
  path: string;
  type: string;
  files: FileInfo[];
}

// Agent Types
export interface AgentRequest {
  agentId: string;
  message: string;
  context?: Record<string, any>;
}

export interface AgentResponse {
  agentId: string;
  response: string;
  metadata?: Record<string, any>;
}

export interface AgentStatus {
  agentId: string;
  status: 'idle' | 'processing' | 'error';
  lastActivity: Date;
}

// Settings Types
export interface SettingsRequest {
  key: string;
  value?: any;
}

// Log Types
export interface LogMessage {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}
