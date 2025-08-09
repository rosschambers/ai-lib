#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const Platform = require('./lib/platform');
const HardLink = require('./lib/hardlink');
const FileOperations = require('./lib/file-operations');

/**
 * Cross-platform VS Code MCP configuration sync script
 * Creates hard link between repository mcp.json and VS Code user directory
 */
class MCPSync {
    constructor() {
        this.repositoryRoot = FileOperations.getRepositoryRoot(__dirname);
        this.sourceFile = path.join(this.repositoryRoot, 'mcp', 'mcp.json');
        this.configurationFile = path.join(__dirname, 'config', 'vscode-paths.json');
        this.platform = new Platform(this.configurationFile);
    }

    /**
     * Get the target MCP configuration file path
     */
    getTargetFile() {
        const vscodeUserDirectory = this.platform.getVSCodeUserDirectory();
        return path.join(vscodeUserDirectory, 'mcp.json');
    }

    /**
     * Verify source file exists
     */
    verifySourceFile() {
        if (!fs.existsSync(this.sourceFile)) {
            console.error(`❌ Source MCP file not found: ${this.sourceFile}`);
            return false;
        }
        return true;
    }

    /**
     * Main sync process
     */
    run() {
        console.log('🚀 Syncing VS Code MCP configuration...');
        console.log(`Platform: ${this.platform.getPlatform()}`);
        console.log(`Repository: ${this.repositoryRoot}`);
        
        // Verify source file exists
        if (!this.verifySourceFile()) {
            process.exit(1);
        }

        // Verify VS Code installation
        if (!this.platform.verifyVSCodeInstallation()) {
            console.log('⚠️  VS Code directory not found - creating target directory anyway.');
        }

        // Get target file path
        const targetFile = this.getTargetFile();
        const targetDirectory = path.dirname(targetFile);
        console.log(`Target file: ${targetFile}`);

        // Ensure target directory exists
        const dirResult = FileOperations.ensureDirectoryExists(targetDirectory);
        if (!dirResult.success) {
            console.error(`❌ Failed to create target directory: ${dirResult.error}`);
            process.exit(1);
        }
        
        if (dirResult.created) {
            console.log(`Created target directory: ${targetDirectory}`);
        }

        // Create hard link
        console.log(`\n🔗 Linking MCP configuration:`);
        console.log(`   Source: ${this.sourceFile}`);
        console.log(`   Target: ${targetFile}`);

        const result = HardLink.create(this.sourceFile, targetFile);

        if (result.success) {
            console.log('   ✅ Success');
            console.log(`\n📊 MCP configuration synced successfully!`);
            console.log(`\n💡 Your MCP servers are now available in VS Code.`);
            console.log(`   Run "MCP: Show Installed Servers" to view them.`);
        } else {
            console.log(`   ❌ Failed: ${result.error}`);
            console.log('\n⚠️  MCP configuration sync failed. Check error message above.');
            process.exit(1);
        }
    }
}

// Run the sync if called directly
if (require.main === module) {
    const mcpSync = new MCPSync();
    mcpSync.run();
}

module.exports = MCPSync;
