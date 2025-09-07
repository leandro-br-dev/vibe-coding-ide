import { app } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import { LogMessage } from '../shared/types/ipc';

export class Logger {
  private static instance: Logger;
  private logPath: string;
  private logQueue: LogMessage[] = [];
  private isWriting = false;

  private constructor() {
    this.logPath = path.join(app.getPath('userData'), 'logs', 'app.log');
    this.ensureLogDirectory();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public error(message: string, context?: Record<string, any>): void {
    const logMessage: LogMessage = {
      level: 'error',
      message,
      timestamp: new Date(),
      ...(context && { context }),
    };

    console.error(`[ERROR] ${message}`, context || '');
    this.writeLog(logMessage);
  }

  public warn(message: string, context?: Record<string, any>): void {
    const logMessage: LogMessage = {
      level: 'warn',
      message,
      timestamp: new Date(),
      ...(context && { context }),
    };

    console.warn(`[WARN] ${message}`, context || '');
    this.writeLog(logMessage);
  }

  public info(message: string, context?: Record<string, any>): void {
    const logMessage: LogMessage = {
      level: 'info',
      message,
      timestamp: new Date(),
      ...(context && { context }),
    };

    console.log(`[INFO] ${message}`, context || '');
    this.writeLog(logMessage);
  }

  public debug(message: string, context?: Record<string, any>): void {
    const logMessage: LogMessage = {
      level: 'debug',
      message,
      timestamp: new Date(),
      ...(context && { context }),
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, context || '');
    }

    this.writeLog(logMessage);
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      const logDir = path.dirname(this.logPath);
      await fs.mkdir(logDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  private writeLog(logMessage: LogMessage): void {
    this.logQueue.push(logMessage);

    if (!this.isWriting) {
      this.processLogQueue();
    }
  }

  private async processLogQueue(): Promise<void> {
    if (this.logQueue.length === 0 || this.isWriting) {
      return;
    }

    this.isWriting = true;

    try {
      const logsToWrite = [...this.logQueue];
      this.logQueue = [];

      const logLines = logsToWrite.map(log => {
        const timestamp = log.timestamp.toISOString();
        const level = log.level.toUpperCase().padEnd(5);
        const contextStr = log.context ? ` ${JSON.stringify(log.context)}` : '';
        return `${timestamp} [${level}] ${log.message}${contextStr}`;
      });

      const logData = logLines.join('\n') + '\n';
      await fs.appendFile(this.logPath, logData, 'utf8');

      // Rotate log if it gets too large (> 10MB)
      await this.rotateLogIfNeeded();
    } catch (error) {
      console.error('Failed to write log:', error);
    } finally {
      this.isWriting = false;

      // Process any logs that were queued while writing
      if (this.logQueue.length > 0) {
        this.processLogQueue();
      }
    }
  }

  private async rotateLogIfNeeded(): Promise<void> {
    try {
      const stats = await fs.stat(this.logPath);
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (stats.size > maxSize) {
        const backupPath = this.logPath + '.old';
        await fs.copyFile(this.logPath, backupPath);
        await fs.writeFile(this.logPath, '');
        console.log('Log file rotated');
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }
}
