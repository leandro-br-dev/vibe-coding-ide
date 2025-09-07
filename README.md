# Vibe Coding IDE

A modern desktop IDE with AI-powered agent system built with Electron and TypeScript.

## Features

- 🤖 AI-powered specialized agents for different development tasks
- 🎯 Intelligent task orchestration and routing
- 🔒 Completely local and private operation
- 🛠️ Familiar VS Code-like interface
- 🌐 Multi-LLM support with intelligent model selection
- ⚡ High-performance Electron + TypeScript architecture

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/leandro-br-dev/vibe-coding-ide.git
cd vibe-coding-ide

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run make` - Build distributable packages

### Project Structure

```
src/
├── main/           # Main Electron process
├── renderer/       # Renderer process (UI)
├── shared/         # Shared utilities and types
├── agents/         # AI agent system
└── types/          # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.
