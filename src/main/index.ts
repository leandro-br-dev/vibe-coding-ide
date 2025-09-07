import { app, BrowserWindow } from 'electron';
import { WindowManager } from './windowManager';
import './ipc/handlers';

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

const windowManager = WindowManager.getInstance();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    const mainWindow = windowManager.getMainWindow();
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

const createWindow = (): void => {
  windowManager.createMainWindow();
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin !== 'http://localhost:3000' && parsedUrl.origin !== 'file://') {
      event.preventDefault();
    }
  });
});

// Handle certificate errors (security)
app.on('certificate-error', (event, _webContents, url, _error, _certificate, callback) => {
  // In development, ignore certificate errors for localhost
  if (process.env.NODE_ENV === 'development' && url.startsWith('http://localhost')) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});

// Set app user model ID for Windows
if (process.platform === 'win32') {
  app.setAppUserModelId('com.vibecodingide.app');
}
