import { BrowserWindow, Menu, screen } from 'electron';
import * as path from 'path';
import { getAppConfig } from './config';
import { createApplicationMenu } from './menu';
import { SecurityManager } from './security';

export class WindowManager {
  private static instance: WindowManager;
  private mainWindow: BrowserWindow | null = null;

  private constructor() {}

  public static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  public createMainWindow(): BrowserWindow {
    const config = getAppConfig();
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const security = SecurityManager.getInstance();

    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: Math.min(config.window.width, width),
      height: Math.min(config.window.height, height),
      minWidth: config.window.minWidth,
      minHeight: config.window.minHeight,
      show: false, // Don't show until ready
      center: true,
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      webPreferences: security.getSecureWebPreferences(path.join(__dirname, 'preload.js')),
      icon: this.getAppIcon(),
    });

    // Set up window events
    this.setupWindowEvents();

    // Setup security
    security.setupWindowSecurity(this.mainWindow);
    security.setupCSP(this.mainWindow);

    // Create application menu
    const menu = createApplicationMenu(this.mainWindow);
    Menu.setApplicationMenu(menu);

    // Load the app
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
      if (config.devTools) {
        this.mainWindow.webContents.openDevTools();
      }
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();

      if (config.debug) {
        console.log('Main window shown');
      }
    });

    return this.mainWindow;
  }

  private setupWindowEvents(): void {
    if (!this.mainWindow) return;

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Handle window minimize/restore
    this.mainWindow.on('minimize', () => {
      console.log('Window minimized');
    });

    this.mainWindow.on('restore', () => {
      console.log('Window restored');
    });

    // Handle window focus
    this.mainWindow.on('focus', () => {
      console.log('Window focused');
    });

    this.mainWindow.on('blur', () => {
      console.log('Window blurred');
    });

    // Prevent new window creation (security)
    this.mainWindow.webContents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });

    // Handle navigation (security)
    this.mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);

      // Only allow localhost in development
      if (process.env.NODE_ENV === 'development') {
        if (parsedUrl.origin !== 'http://localhost:3000') {
          event.preventDefault();
        }
      } else {
        // In production, prevent all navigation
        event.preventDefault();
      }
    });
  }

  private getAppIcon(): string {
    // Return appropriate icon path based on platform
    if (process.platform === 'win32') {
      return path.join(__dirname, '../../assets/icon.ico');
    } else if (process.platform === 'darwin') {
      return path.join(__dirname, '../../assets/icon.icns');
    } else {
      return path.join(__dirname, '../../assets/icon.png');
    }
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  public closeMainWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
  }

  public focusMainWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.focus();
    }
  }
}
