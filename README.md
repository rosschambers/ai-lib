# AI Tools Library

A comprehensive collection of AI productivity tools, custom instructions, chat modes, MCP servers, and automation scripts designed to enhance your AI-assisted development workflow.

## 🎯 Vision

This repository serves as the **single source of truth** for generic AI productivity tools that work across different platforms and projects. It provides one-way sync capabilities to install high-quality chat modes, custom instructions, and AI configurations to your global user directories, ensuring consistent AI assistance regardless of which project you're working on.

## 📁 Current Contents

### GitHub Copilot Chat Modes

Professional chat modes located in `chat-modes/`:

- **`meta-instructions.chatmode.md`** - GitHub Copilot custom instructions specialist that creates and optimizes repository-wide instruction sets following best practices
- **`meta-modes.chatmode.md`** - Chat mode designer that creates and refines custom VS Code chat modes with optimal tool selection and capabilities

### Custom Instructions

Generic AI instruction sets located in `instructions/`:

- **`clarity-simplicity.instructions.md`** - Universal instructions for clear, concise AI responses across all platforms
- **`personal-info.instructions.md`** - Guidelines for AI tools to handle personal information with memory integration
- **`task-planning.instructions.md`** - Instructions for structured task breakdown and planning workflows

### Sync Library

Reusable utilities in `scripts/lib/`:

- **`file-operations.js`** - Generic file system operations with repository root detection
- **`hardlink.js`** - Cross-platform hard link creation and management
- **`platform.js`** - Platform detection and VS Code directory path resolution

## 🚀 Getting Started

### Prerequisites

- VS Code with GitHub Copilot extension
- Access to GitHub Copilot Chat
- Node.js (version 14 or higher)

### Quick Setup

1. **Clone this repository:**
   ```bash
   git clone https://github.com/[your-username]/ai-lib.git
   cd ai-lib
   ```

2. **Sync AI Tools (Automatic):**
   ```bash
   npm run sync
   ```
   This automatically syncs both chat modes and custom instructions to your VS Code user directory using hard links.
   
   **Individual sync options:**
   ```bash
   # Sync only chat modes
   npm run sync:chat-modes
   
   # Sync only custom instructions  
   npm run sync:instructions
   ```

### Adding New AI Tools

1. **Create new files** in the appropriate directory:
   - Chat modes: `chat-modes/your-mode.chatmode.md`
   - Instructions: `instructions/your-instructions.instructions.md`
2. **Run the sync script** to synchronize:
   ```bash
   npm run sync
   ```
3. **Your new tools** will be immediately available in VS Code

## 📚 Usage

### Chat Modes

Once installed globally, these chat modes are available in **any** VS Code workspace, not just this repository:

#### Meta-Instructions Mode
Use `@meta-instructions` when you want to:
- Create comprehensive custom instructions for your projects
- Optimize existing GitHub Copilot instruction sets
- Design repository-wide AI assistance strategies
- Implement best practices for AI-assisted development

Example:
```
@meta-instructions Create custom instructions for a React TypeScript project with emphasis on component design patterns and testing standards
```

#### Meta-Modes Mode
Use `@meta-modes` when you want to:
- Design new specialized chat modes for specific workflows
- Enhance existing chat modes with better tool selection
- Create domain-specific AI assistants
- Optimize chat mode instructions and capabilities

Example:
```
@meta-modes Create a chat mode specialized for API design and documentation that includes tools for schema validation and testing
```

### Custom Instructions

The synced instruction files enhance AI interactions across all VS Code workspaces:

#### Available Instructions
- **Clarity & Simplicity** - Ensures concise, focused AI responses
- **Personal Information Handling** - Manages user data with memory integration  
- **Task Planning** - Structures complex work into manageable steps

These instructions work automatically once synced and apply to all AI interactions in VS Code.

### Sync Strategy

This repository uses a **one-way sync** approach:
- **Source of Truth**: This repository contains the master versions
- **Installation**: Tools sync FROM this repo TO your global user directories
- **Updates**: Pull updates from this repo and re-sync to get latest versions
- **No Conflicts**: Your personal customizations go in separate directories/files

## 🔧 Library Architecture

### Repository Root Detection

All sync scripts use a generic method to detect the repository root by searching upwards for marker files (`package.json` or `.git`). This ensures robust and future-proof detection regardless of folder structure.

**Usage Example:**

```js
const FileOperations = require('./scripts/lib/file-operations');
const repoRoot = FileOperations.getRepositoryRoot(__filename);
console.log('Repository root:', repoRoot);
```

- The method returns the directory containing the marker file, or `null` if not found
- Works for any repo layout, not just when scripts are in specific subfolders
- Powers both chat mode and instruction sync functionality

### Shared Utilities

The `scripts/lib/` directory contains reusable components:
- **FileOperations** - Directory creation, file discovery, path mapping
- **HardLink** - Cross-platform hard link creation and management  
- **Platform** - OS detection and VS Code path resolution

This modular approach ensures consistent behavior across all sync operations.

## 🤝 Contributing

This is a personal AI tools collection, but contributions and suggestions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-ai-tool`
3. Commit your changes: `git commit -am 'Add new AI tool'`
4. Push to the branch: `git push origin feature/new-ai-tool`
5. Submit a pull request

## 📝 Documentation

- [VS Code Custom Chat Modes Documentation](https://code.visualstudio.com/docs/copilot/chat/chat-modes#_custom-chat-modes)
- [GitHub Copilot Instructions Best Practices](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot-in-vs-code)

## 🛣️ Roadmap

See [TODO.md](TODO.md) for detailed planned features and implementation approaches.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏷️ Tags

`ai-tools` `github-copilot` `vs-code` `chat-modes` `custom-instructions` `productivity` `automation` `mcp-servers` `ai-assistance`
