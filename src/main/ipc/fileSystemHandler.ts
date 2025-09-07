import { IpcMainInvokeEvent } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import {
  FileReadRequest,
  FileWriteRequest,
  DirectoryReadRequest,
  FileInfo,
} from '../../shared/types/ipc';
import { Logger } from '../logger';
import { SecurityManager } from '../security';

const logger = Logger.getInstance();

export class FileSystemHandler {
  async readFile(_event: IpcMainInvokeEvent, request: FileReadRequest): Promise<string> {
    const { filePath, encoding = 'utf8' } = request;

    logger.debug('Reading file:', { filePath, encoding });

    // Security: Validate file path
    const resolvedPath = path.resolve(filePath);
    if (!this.isPathSafe(resolvedPath)) {
      throw new Error('Invalid file path');
    }

    try {
      const content = await fs.readFile(resolvedPath, encoding);
      logger.debug('File read successfully:', { filePath, size: content.length });
      return content;
    } catch (error) {
      logger.error('Failed to read file:', { filePath, error });
      throw error;
    }
  }

  async writeFile(_event: IpcMainInvokeEvent, request: FileWriteRequest): Promise<void> {
    const { filePath, content, encoding = 'utf8' } = request;

    logger.debug('Writing file:', { filePath, encoding, size: content.length });

    // Security: Validate file path
    const resolvedPath = path.resolve(filePath);
    if (!this.isPathSafe(resolvedPath)) {
      throw new Error('Invalid file path');
    }

    // Security: Validate content
    const security = SecurityManager.getInstance();
    const fileExtension = path.extname(resolvedPath);
    if (!security.isContentSafe(content, fileExtension)) {
      throw new Error('Content contains potentially dangerous patterns');
    }

    try {
      // Ensure directory exists
      const dirPath = path.dirname(resolvedPath);
      await fs.mkdir(dirPath, { recursive: true });

      // Write file
      await fs.writeFile(resolvedPath, content, encoding);
      logger.debug('File written successfully:', { filePath });
    } catch (error) {
      logger.error('Failed to write file:', { filePath, error });
      throw error;
    }
  }

  async readDirectory(
    _event: IpcMainInvokeEvent,
    request: DirectoryReadRequest
  ): Promise<FileInfo[]> {
    const { dirPath, recursive = false } = request;

    logger.debug('Reading directory:', { dirPath, recursive });

    // Security: Validate directory path
    const resolvedPath = path.resolve(dirPath);
    if (!this.isPathSafe(resolvedPath)) {
      throw new Error('Invalid directory path');
    }

    try {
      const files: FileInfo[] = [];
      await this.scanDirectory(resolvedPath, files, recursive);

      logger.debug('Directory read successfully:', { dirPath, fileCount: files.length });
      return files;
    } catch (error) {
      logger.error('Failed to read directory:', { dirPath, error });
      throw error;
    }
  }

  private async scanDirectory(
    dirPath: string,
    files: FileInfo[],
    recursive: boolean
  ): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      // Skip hidden files and node_modules
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      try {
        const stats = await fs.stat(fullPath);

        const fileInfo: FileInfo = {
          name: entry.name,
          path: fullPath,
          isDirectory: entry.isDirectory(),
          size: stats.size,
          modified: stats.mtime,
        };

        files.push(fileInfo);

        // Recursively scan subdirectories
        if (recursive && entry.isDirectory()) {
          await this.scanDirectory(fullPath, files, recursive);
        }
      } catch (error) {
        logger.warn('Failed to get file stats:', { path: fullPath, error });
      }
    }
  }

  private isPathSafe(filePath: string): boolean {
    const security = SecurityManager.getInstance();
    return security.isPathSafe(filePath);
  }
}
