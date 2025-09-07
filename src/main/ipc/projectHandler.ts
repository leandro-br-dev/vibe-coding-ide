import { IpcMainInvokeEvent } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import { ProjectOpenRequest, ProjectInfo, FileInfo } from '../../shared/types/ipc';
import { Logger } from '../logger';

const logger = Logger.getInstance();

export class ProjectHandler {
  private currentProject: ProjectInfo | null = null;

  async openProject(_event: IpcMainInvokeEvent, request: ProjectOpenRequest): Promise<ProjectInfo> {
    const { projectPath } = request;

    logger.info('Opening project:', { projectPath });

    try {
      // Validate project path
      const resolvedPath = path.resolve(projectPath);
      const stats = await fs.stat(resolvedPath);

      if (!stats.isDirectory()) {
        throw new Error('Project path must be a directory');
      }

      // Detect project type
      const projectType = await this.detectProjectType(resolvedPath);

      // Get project files (non-recursive for performance)
      const files = await this.getProjectFiles(resolvedPath);

      const projectInfo: ProjectInfo = {
        name: path.basename(resolvedPath),
        path: resolvedPath,
        type: projectType,
        files,
      };

      this.currentProject = projectInfo;
      logger.info('Project opened successfully:', { name: projectInfo.name, type: projectType });

      return projectInfo;
    } catch (error) {
      logger.error('Failed to open project:', { projectPath, error });
      throw error;
    }
  }

  async closeProject(_event: IpcMainInvokeEvent): Promise<void> {
    if (this.currentProject) {
      logger.info('Closing project:', { name: this.currentProject.name });
      this.currentProject = null;
    }
  }

  async getProjectInfo(_event: IpcMainInvokeEvent): Promise<ProjectInfo | null> {
    return this.currentProject;
  }

  private async detectProjectType(projectPath: string): Promise<string> {
    const indicators = [
      { file: 'package.json', type: 'Node.js/JavaScript' },
      { file: 'Cargo.toml', type: 'Rust' },
      { file: 'go.mod', type: 'Go' },
      { file: 'requirements.txt', type: 'Python' },
      { file: 'pom.xml', type: 'Java (Maven)' },
      { file: 'build.gradle', type: 'Java (Gradle)' },
      { file: '.csproj', type: 'C#' },
      { file: 'Gemfile', type: 'Ruby' },
      { file: 'composer.json', type: 'PHP' },
    ];

    for (const indicator of indicators) {
      try {
        const filePath = path.join(projectPath, indicator.file);
        await fs.access(filePath);
        return indicator.type;
      } catch {
        // File doesn't exist, continue
      }
    }

    // Check for common directory patterns
    const dirs = await fs.readdir(projectPath, { withFileTypes: true });
    const dirNames = dirs.filter(d => d.isDirectory()).map(d => d.name);

    if (dirNames.includes('src') && dirNames.includes('public')) {
      return 'React/Frontend';
    }

    if (dirNames.includes('app') && dirNames.includes('config')) {
      return 'Rails/Laravel';
    }

    return 'Unknown';
  }

  private async getProjectFiles(projectPath: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    try {
      const entries = await fs.readdir(projectPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip hidden files and common ignore patterns
        if (this.shouldIgnoreFile(entry.name)) {
          continue;
        }

        const fullPath = path.join(projectPath, entry.name);

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
        } catch (error) {
          logger.warn('Failed to get file stats:', { path: fullPath, error });
        }
      }

      // Sort files: directories first, then by name
      files.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      return files;
    } catch (error) {
      logger.error('Failed to get project files:', { projectPath, error });
      return [];
    }
  }

  private shouldIgnoreFile(fileName: string): boolean {
    const ignorePatterns = [
      /^\./, // Hidden files
      /^node_modules$/,
      /^\.git$/,
      /^dist$/,
      /^build$/,
      /^out$/,
      /^target$/,
      /^__pycache__$/,
      /\.pyc$/,
      /^\.vscode$/,
      /^\.idea$/,
    ];

    return ignorePatterns.some(pattern => pattern.test(fileName));
  }
}
