import { BrowserWindow, shell, dialog } from 'electron';
import { URL } from 'url';

export class SecurityManager {
  private static instance: SecurityManager;

  private constructor() {}

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Get secure web preferences for BrowserWindow
   */
  public getSecureWebPreferences(preloadPath: string): Electron.WebPreferences {
    return {
      // Security: Disable node integration
      nodeIntegration: false,

      // Security: Enable context isolation
      contextIsolation: true,

      // Security: Disable background throttling
      backgroundThrottling: false,

      // Security: Disable running insecure content
      allowRunningInsecureContent: false,

      // Security: Disable experimental features
      experimentalFeatures: false,

      // Security: Enable web security
      webSecurity: true,

      // Security: Additional options
      spellcheck: false,

      // Security: Preload script path
      preload: preloadPath,

      // Security: Sandbox mode (disabled for now as it limits functionality)
      // sandbox: true,

      // Security: Disable Node.js CLI options
      additionalArguments: ['--disable-features=VizDisplayCompositor'],
    };
  }

  /**
   * Setup security event handlers for a BrowserWindow
   */
  public setupWindowSecurity(window: BrowserWindow): void {
    // Prevent new window creation
    window.webContents.setWindowOpenHandler(({ url }) => {
      // Log the attempt
      console.warn('Blocked window.open attempt:', url);

      // Show warning to user
      dialog.showMessageBox(window, {
        type: 'warning',
        title: 'Security Warning',
        message: 'Opening new windows is not allowed for security reasons.',
        detail: `Attempted to open: ${url}`,
      });

      return { action: 'deny' };
    });

    // Handle navigation attempts
    window.webContents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);

      if (!this.isUrlAllowed(parsedUrl)) {
        console.warn('Blocked navigation attempt:', navigationUrl);
        event.preventDefault();

        dialog.showMessageBox(window, {
          type: 'warning',
          title: 'Security Warning',
          message: 'Navigation to external sites is not allowed.',
          detail: `Attempted to navigate to: ${navigationUrl}`,
        });
      }
    });

    // Handle external link clicks
    window.webContents.setWindowOpenHandler(({ url }) => {
      if (this.isExternalUrl(url)) {
        // Open in system browser
        shell.openExternal(url);
      }
      return { action: 'deny' };
    });

    // Additional security measures
    window.webContents.on('did-finish-load', () => {
      console.log('Page loaded with security measures active');
    });

    // Handle permission requests
    window.webContents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
      // Deny all permission requests by default
      const allowedPermissions: string[] = [];

      if (allowedPermissions.includes(permission)) {
        callback(true);
      } else {
        console.warn('Denied permission request:', permission);
        callback(false);
      }
    });

    // Block certain URLs
    window.webContents.session.webRequest.onBeforeRequest((details, callback) => {
      const url = new URL(details.url);

      if (this.isBlockedUrl(url)) {
        console.warn('Blocked request to:', details.url);
        callback({ cancel: true });
      } else {
        callback({ cancel: false });
      }
    });
  }

  /**
   * Setup Content Security Policy
   */
  public setupCSP(window: BrowserWindow): void {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // React needs unsafe-inline and unsafe-eval
      "style-src 'self' 'unsafe-inline'", // Allow inline styles for React
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' ws://localhost:* http://localhost:*", // Allow WebSocket for development
      "media-src 'self'",
      "object-src 'none'",
      "child-src 'none'",
      "worker-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join('; ');

    window.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [csp],
          'X-Frame-Options': ['DENY'],
          'X-Content-Type-Options': ['nosniff'],
          'Referrer-Policy': ['same-origin'],
          'Permissions-Policy': ['geolocation=(), camera=(), microphone=(), payment=(), usb=()'],
        },
      });
    });
  }

  /**
   * Check if URL is allowed for navigation
   */
  private isUrlAllowed(url: URL): boolean {
    // Allow localhost in development
    if (process.env.NODE_ENV === 'development') {
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return true;
      }
    }

    // Allow file:// protocol for production builds
    if (url.protocol === 'file:') {
      return true;
    }

    return false;
  }

  /**
   * Check if URL is external (should be opened in system browser)
   */
  private isExternalUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Check if URL should be blocked
   */
  private isBlockedUrl(url: URL): boolean {
    const blockedDomains = [
      'ads.google.com',
      'doubleclick.net',
      'googletagmanager.com',
      'google-analytics.com',
      'facebook.com',
      'twitter.com',
    ];

    return blockedDomains.some(domain => url.hostname.includes(domain));
  }

  /**
   * Validate file path for security
   */
  public isPathSafe(filePath: string): boolean {
    // Prevent path traversal
    if (filePath.includes('..') || filePath.includes('~')) {
      return false;
    }

    // Prevent access to system files
    const dangerousPaths = [
      '/etc/',
      '/usr/',
      '/bin/',
      '/sbin/',
      '/var/',
      'C:\\Windows\\',
      'C:\\Program Files\\',
      'C:\\Program Files (x86)\\',
    ];

    return !dangerousPaths.some(path => filePath.startsWith(path));
  }

  /**
   * Sanitize user input
   */
  public sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>\"']/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .trim();
  }

  /**
   * Validate file content before processing
   */
  public isContentSafe(content: string, fileExtension: string): boolean {
    // Check for suspicious patterns
    const dangerousPatterns = [
      /<script[^>]*>/gi,
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
    ];

    // Only check web-related files
    const webExtensions = ['.html', '.htm', '.xml', '.svg'];
    if (webExtensions.includes(fileExtension.toLowerCase())) {
      return !dangerousPatterns.some(pattern => pattern.test(content));
    }

    return true;
  }
}
