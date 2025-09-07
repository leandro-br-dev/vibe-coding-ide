// File icon mappings based on file extensions and names
export function getFileIcon(fileName: string, isDirectory: boolean): string {
  if (isDirectory) {
    return getFolderIcon(fileName);
  }
  
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Programming languages
  const languageIcons: Record<string, string> = {
    // JavaScript/TypeScript
    'js': '🟨',
    'jsx': '⚛️',
    'ts': '🔷',
    'tsx': '⚛️',
    'json': '📋',
    'json5': '📋',
    'jsonc': '📋',
    
    // Web technologies
    'html': '🌐',
    'htm': '🌐',
    'xml': '📰',
    'css': '🎨',
    'scss': '🎨',
    'sass': '🎨',
    'less': '🎨',
    'stylus': '🎨',
    
    // Python
    'py': '🐍',
    'pyw': '🐍',
    'pyc': '🐍',
    'pyo': '🐍',
    'pyd': '🐍',
    'pyz': '🐍',
    
    // Java
    'java': '☕',
    'class': '☕',
    'jar': '☕',
    'war': '☕',
    
    // C/C++
    'c': '🔧',
    'cpp': '🔧',
    'cxx': '🔧',
    'cc': '🔧',
    'c++': '🔧',
    'h': '📋',
    'hpp': '📋',
    'hxx': '📋',
    
    // C#
    'cs': '🟣',
    'csx': '🟣',
    'csproj': '🟣',
    
    // Go
    'go': '🐹',
    'mod': '🐹',
    'sum': '🐹',
    
    // Rust
    'rs': '🦀',
    'toml': '📋',
    
    // PHP
    'php': '🐘',
    'phtml': '🐘',
    'php3': '🐘',
    'php4': '🐘',
    'php5': '🐘',
    
    // Ruby
    'rb': '💎',
    'erb': '💎',
    'gemspec': '💎',
    
    // Shell scripts
    'sh': '⚡',
    'bash': '⚡',
    'zsh': '⚡',
    'fish': '⚡',
    'bat': '⚡',
    'cmd': '⚡',
    'ps1': '⚡',
    
    // Configuration files
    'yaml': '⚙️',
    'yml': '⚙️',
    'ini': '⚙️',
    'cfg': '⚙️',
    'conf': '⚙️',
    'config': '⚙️',
    'env': '⚙️',
    
    // Documentation
    'md': '📝',
    'markdown': '📝',
    'txt': '📄',
    'rtf': '📄',
    'pdf': '📕',
    'doc': '📘',
    'docx': '📘',
    'odt': '📘',
    
    // Images
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'bmp': '🖼️',
    'svg': '🎨',
    'ico': '🖼️',
    'webp': '🖼️',
    
    // Audio
    'mp3': '🎵',
    'wav': '🎵',
    'flac': '🎵',
    'aac': '🎵',
    'ogg': '🎵',
    'm4a': '🎵',
    
    // Video
    'mp4': '🎬',
    'avi': '🎬',
    'mkv': '🎬',
    'mov': '🎬',
    'wmv': '🎬',
    'webm': '🎬',
    
    // Archives
    'zip': '📦',
    'rar': '📦',
    '7z': '📦',
    'tar': '📦',
    'gz': '📦',
    'bz2': '📦',
    'xz': '📦',
    
    // Database
    'sql': '🗄️',
    'db': '🗄️',
    'sqlite': '🗄️',
    'sqlite3': '🗄️',
    'mdb': '🗄️',
    
    // Other common files
    'log': '📊',
    'lock': '🔒',
    'key': '🔐',
    'pem': '🔐',
    'crt': '🔐',
    'cert': '🔐',
  };
  
  // Special file names
  const specialFiles: Record<string, string> = {
    'package.json': '📦',
    'package-lock.json': '🔒',
    'yarn.lock': '🔒',
    'pnpm-lock.yaml': '🔒',
    'composer.json': '📦',
    'composer.lock': '🔒',
    'requirements.txt': '📦',
    'Pipfile': '📦',
    'Pipfile.lock': '🔒',
    'poetry.lock': '🔒',
    'Cargo.toml': '📦',
    'Cargo.lock': '🔒',
    'go.mod': '📦',
    'go.sum': '🔒',
    'Makefile': '🔨',
    'makefile': '🔨',
    'CMakeLists.txt': '🔨',
    'Dockerfile': '🐳',
    'docker-compose.yml': '🐳',
    'docker-compose.yaml': '🐳',
    '.dockerignore': '🐳',
    '.gitignore': '🙈',
    '.gitattributes': '📋',
    'README.md': '📖',
    'README.txt': '📖',
    'README': '📖',
    'CHANGELOG.md': '📝',
    'LICENSE': '📜',
    'LICENSE.txt': '📜',
    'MIT': '📜',
    '.env': '🌍',
    '.env.local': '🌍',
    '.env.development': '🌍',
    '.env.production': '🌍',
    'tsconfig.json': '🔷',
    'jsconfig.json': '🟨',
    'webpack.config.js': '📦',
    'vite.config.js': '⚡',
    'vite.config.ts': '⚡',
    'rollup.config.js': '📦',
    'babel.config.js': '🔄',
    '.babelrc': '🔄',
    'eslint.config.js': '📏',
    '.eslintrc': '📏',
    '.eslintrc.js': '📏',
    '.eslintrc.json': '📏',
    'prettier.config.js': '💅',
    '.prettierrc': '💅',
    '.prettierrc.json': '💅',
  };
  
  // Check special files first
  if (specialFiles[fileName]) {
    return specialFiles[fileName];
  }
  
  // Check by extension
  if (languageIcons[extension]) {
    return languageIcons[extension];
  }
  
  // Default file icon
  return '📄';
}

function getFolderIcon(folderName: string): string {
  const specialFolders: Record<string, string> = {
    'node_modules': '📦',
    'dist': '📦',
    'build': '📦',
    'out': '📦',
    'target': '📦',
    'bin': '📦',
    'obj': '📦',
    'src': '📁',
    'source': '📁',
    'sources': '📁',
    'lib': '📚',
    'libs': '📚',
    'library': '📚',
    'libraries': '📚',
    'vendor': '📚',
    'vendors': '📚',
    'third_party': '📚',
    'thirdparty': '📚',
    'external': '📚',
    'assets': '🎨',
    'images': '🖼️',
    'img': '🖼️',
    'icons': '🎨',
    'styles': '🎨',
    'css': '🎨',
    'scss': '🎨',
    'sass': '🎨',
    'components': '🧩',
    'component': '🧩',
    'views': '👁️',
    'pages': '📄',
    'routes': '🛤️',
    'router': '🛤️',
    'controllers': '🎮',
    'controller': '🎮',
    'models': '📊',
    'model': '📊',
    'services': '⚙️',
    'service': '⚙️',
    'utils': '🔧',
    'utilities': '🔧',
    'helpers': '🤝',
    'helper': '🤝',
    'middleware': '🔄',
    'middlewares': '🔄',
    'plugins': '🔌',
    'plugin': '🔌',
    'extensions': '🧩',
    'extension': '🧩',
    'config': '⚙️',
    'configuration': '⚙️',
    'settings': '⚙️',
    'public': '🌐',
    'static': '🌐',
    'www': '🌐',
    'web': '🌐',
    'tests': '🧪',
    'test': '🧪',
    'spec': '🧪',
    'specs': '🧪',
    '__tests__': '🧪',
    'docs': '📚',
    'doc': '📚',
    'documentation': '📚',
    'examples': '💡',
    'example': '💡',
    'samples': '💡',
    'sample': '💡',
    'demo': '💡',
    'demos': '💡',
    'scripts': '📝',
    'script': '📝',
    'tools': '🔨',
    'tool': '🔨',
    'build-tools': '🔨',
    'ci': '🔄',
    'deployment': '🚀',
    'deploy': '🚀',
    '.git': '📂',
    '.github': '🐙',
    '.gitlab': '🦊',
    '.vscode': '💙',
    '.idea': '💡',
    'temp': '🗂️',
    'tmp': '🗂️',
    'cache': '💾',
    'logs': '📊',
    'log': '📊',
    'backup': '💾',
    'backups': '💾',
  };
  
  const lowerName = folderName.toLowerCase();
  
  if (specialFolders[lowerName]) {
    return specialFolders[lowerName];
  }
  
  // Hidden folders
  if (folderName.startsWith('.')) {
    return '📂';
  }
  
  // Default folder icon
  return '📁';
}