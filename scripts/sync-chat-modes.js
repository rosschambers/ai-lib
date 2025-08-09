#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Cross-platform VS Code chat modes sync script
 * Creates hard links between repository chat modes and VS Code user directory
 */
class ChatModeSync {
    constructor() {
        this.platform = process.platform;
        this.repository_root = path.resolve(__dirname, '..');
        this.source_directory = path.join(this.repository_root, 'chat-modes');
        this.configuration_file = path.join(__dirname, 'config', 'vscode-paths.json');
        this.configuration = this.loadConfiguration();
    }

    /**
     * Load platform-specific configuration from JSON file
     */
    loadConfiguration() {
        try {
            const configuration_content = fs.readFileSync(this.configuration_file, 'utf8');
            return JSON.parse(configuration_content);
        } catch (error) {
            console.error(`Error loading configuration: ${error.message}`);
            process.exit(1);
        }
    }

    /**
     * Expand environment variables in path strings
     */
    expandEnvironmentVariables(path_string) {
        if (this.platform === 'win32') {
            // Handle Windows environment variables like %APPDATA%
            return path_string.replace(/%([^%]+)%/g, (match, variable_name) => {
                return process.env[variable_name] || match;
            });
        } else {
            // Handle Unix-style environment variables like $HOME
            return path_string.replace(/\$([A-Z_][A-Z0-9_]*)/g, (match, variable_name) => {
                return process.env[variable_name] || match;
            });
        }
    }

    /**
     * Get the target directory for VS Code chat modes on current platform
     */
    getTargetDirectory() {
        const platform_configuration = this.configuration.platforms[this.platform];
        if (!platform_configuration) {
            throw new Error(`Unsupported platform: ${this.platform}`);
        }

        const base_path = this.expandEnvironmentVariables(platform_configuration.base_path);
        const prompts_subdirectory = platform_configuration.prompts_subdirectory;
        
        return path.join(base_path, prompts_subdirectory);
    }

    /**
     * Ensure target directory exists, create if necessary
     */
    ensureTargetDirectoryExists(target_directory) {
        try {
            if (!fs.existsSync(target_directory)) {
                console.log(`Creating target directory: ${target_directory}`);
                fs.mkdirSync(target_directory, { recursive: true });
            }
            return true;
        } catch (error) {
            console.error(`Error creating target directory: ${error.message}`);
            return false;
        }
    }

    /**
     * Find all .chatmode.md files in the source directory
     */
    findChatModeFiles() {
        try {
            if (!fs.existsSync(this.source_directory)) {
                console.error(`Source directory does not exist: ${this.source_directory}`);
                return [];
            }

            const all_files = fs.readdirSync(this.source_directory);
            const chat_mode_files = all_files.filter(filename => 
                filename.endsWith('.chatmode.md')
            );

            return chat_mode_files.map(filename => ({
                filename: filename,
                source_path: path.join(this.source_directory, filename),
                target_path: path.join(this.getTargetDirectory(), filename)
            }));
        } catch (error) {
            console.error(`Error finding chat mode files: ${error.message}`);
            return [];
        }
    }

    /**
     * Create hard link from source to target
     */
    createHardLink(source_path, target_path) {
        try {
            // Remove existing target file if it exists
            if (fs.existsSync(target_path)) {
                fs.unlinkSync(target_path);
                console.log(`Removed existing file: ${target_path}`);
            }

            // Create hard link
            fs.linkSync(source_path, target_path);
            return true;
        } catch (error) {
            console.error(`Error creating hard link: ${error.message}`);
            return false;
        }
    }

    /**
     * Verify VS Code installation by checking if base directory exists
     */
    verifyVSCodeInstallation() {
        const platform_configuration = this.configuration.platforms[this.platform];
        const base_path = this.expandEnvironmentVariables(platform_configuration.base_path);
        
        if (!fs.existsSync(base_path)) {
            console.warn(`VS Code user directory not found: ${base_path}`);
            console.warn('This might indicate VS Code is not installed or uses a different location.');
            return false;
        }
        return true;
    }

    /**
     * Main sync process
     */
    run() {
        console.log('🚀 Syncing VS Code chat modes...');
        console.log(`Platform: ${this.platform}`);
        console.log(`Repository: ${this.repository_root}`);
        
        // Verify VS Code installation
        if (!this.verifyVSCodeInstallation()) {
            console.log('⚠️  Continuing anyway - VS Code directory will be created if needed.');
        }

        // Get target directory
        const target_directory = this.getTargetDirectory();
        console.log(`Target directory: ${target_directory}`);

        // Ensure target directory exists
        if (!this.ensureTargetDirectoryExists(target_directory)) {
            console.error('❌ Failed to create target directory');
            process.exit(1);
        }

        // Find chat mode files
        const chat_mode_files = this.findChatModeFiles();
        if (chat_mode_files.length === 0) {
            console.log('ℹ️  No chat mode files found in source directory');
            console.log(`Source directory: ${this.source_directory}`);
            return;
        }

        console.log(`\n📁 Found ${chat_mode_files.length} chat mode file(s):`);
        
        // Create hard links
        let successful_links = 0;
        let failed_links = 0;

        for (const file_info of chat_mode_files) {
            console.log(`\n🔗 Linking: ${file_info.filename}`);
            console.log(`   Source: ${file_info.source_path}`);
            console.log(`   Target: ${file_info.target_path}`);

            if (this.createHardLink(file_info.source_path, file_info.target_path)) {
                console.log('   ✅ Success');
                successful_links++;
            } else {
                console.log('   ❌ Failed');
                failed_links++;
            }
        }

        // Summary
        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Successful links: ${successful_links}`);
        console.log(`   ❌ Failed links: ${failed_links}`);

        if (failed_links > 0) {
            console.log('\n⚠️  Some files failed to link. Check error messages above.');
            process.exit(1);
        } else {
            console.log('\n🎉 All chat modes successfully linked!');
            console.log('Your VS Code chat modes are now synchronized with this repository.');
        }
    }
}

// Run the sync if this script is executed directly
if (require.main === module) {
    const sync = new ChatModeSync();
    sync.run();
}

module.exports = ChatModeSync;
