import { IpcMainInvokeEvent } from 'electron';
import { app } from 'electron';
import { promises as fs } from 'fs';
import * as path from 'path';
import { SettingsRequest } from '../../shared/types/ipc';
import { Logger } from '../logger';

const logger = Logger.getInstance();

export class SettingsHandler {
  private settingsPath: string;
  private settings: Record<string, any> = {};
  private isLoaded = false;

  constructor() {
    this.settingsPath = path.join(app.getPath('userData'), 'settings.json');
    this.loadSettings();
  }

  async getSetting(_event: IpcMainInvokeEvent, request: SettingsRequest): Promise<any> {
    const { key } = request;

    if (!this.isLoaded) {
      await this.loadSettings();
    }

    logger.debug('Getting setting:', { key });
    return this.getNestedValue(this.settings, key);
  }

  async setSetting(_event: IpcMainInvokeEvent, request: SettingsRequest): Promise<void> {
    const { key, value } = request;

    if (!this.isLoaded) {
      await this.loadSettings();
    }

    logger.debug('Setting value:', { key, value });

    this.setNestedValue(this.settings, key, value);
    await this.saveSettings();
  }

  async resetSettings(_event: IpcMainInvokeEvent): Promise<void> {
    logger.info('Resetting settings to defaults');

    this.settings = this.getDefaultSettings();
    await this.saveSettings();
  }

  private async loadSettings(): Promise<void> {
    try {
      const data = await fs.readFile(this.settingsPath, 'utf8');
      this.settings = JSON.parse(data) as Record<string, any>;
      logger.info('Settings loaded successfully');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Settings file doesn't exist, use defaults
        this.settings = this.getDefaultSettings();
        await this.saveSettings();
        logger.info('Created default settings file');
      } else {
        logger.error('Failed to load settings:', { error });
        this.settings = this.getDefaultSettings();
      }
    }
    this.isLoaded = true;
  }

  private async saveSettings(): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.settingsPath);
      await fs.mkdir(dir, { recursive: true });

      // Save settings
      const data = JSON.stringify(this.settings, null, 2);
      await fs.writeFile(this.settingsPath, data, 'utf8');

      logger.debug('Settings saved successfully');
    } catch (error) {
      logger.error('Failed to save settings:', { error });
      throw error;
    }
  }

  private getDefaultSettings(): Record<string, any> {
    return {
      window: {
        width: 1400,
        height: 900,
        maximized: false,
        theme: 'dark',
      },
      editor: {
        fontSize: 14,
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        tabSize: 2,
        wordWrap: true,
        lineNumbers: true,
        minimap: true,
      },
      ai: {
        providers: {},
        defaultModel: '',
        performanceMode: 'regular',
      },
      project: {
        autoSave: true,
        autoFormat: true,
        showHiddenFiles: false,
      },
      terminal: {
        fontSize: 12,
        shell: process.platform === 'win32' ? 'cmd.exe' : 'bash',
      },
    };
  }

  private getNestedValue(obj: Record<string, any>, key: string): any {
    const keys = key.split('.');
    let current = obj as any;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return undefined;
      }
    }

    return current;
  }

  private setNestedValue(obj: Record<string, any>, key: string, value: any): void {
    const keys = key.split('.');
    const lastKey = keys.pop()!;
    let current = obj as any;

    // Navigate to the parent object
    for (const k of keys) {
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k];
    }

    // Set the value
    current[lastKey] = value;
  }
}
