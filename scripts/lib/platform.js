#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Platform detection and path resolution utilities
 */
class Platform {
    constructor(configPath) {
        this.platform = process.platform;
        this.configPath = configPath;
        this.config = this.loadConfiguration();
    }

    /**
     * Load platform-specific configuration from JSON file
     */
    loadConfiguration() {
        try {
            const configContent = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(configContent);
        } catch (error) {
            throw new Error(`Error loading configuration: ${error.message}`);
        }
    }

    /**
     * Expand environment variables in path strings
     */
    expandEnvironmentVariables(pathString) {
        if (this.platform === 'win32') {
            // Handle Windows environment variables like %APPDATA%
            return pathString.replace(/%([^%]+)%/g, (match, variableName) => {
                return process.env[variableName] || match;
            });
        } else {
            // Handle Unix-style environment variables like $HOME
            return pathString.replace(/\$([A-Z_][A-Z0-9_]*)/g, (match, variableName) => {
                return process.env[variableName] || match;
            });
        }
    }

    /**
     * Get the target directory for VS Code prompts on current platform
     */
    getVSCodePromptsDirectory() {
        const platformConfig = this.config.platforms[this.platform];
        if (!platformConfig) {
            throw new Error(`Unsupported platform: ${this.platform}`);
        }

        const basePath = this.expandEnvironmentVariables(platformConfig.base_path);
        const promptsSubdirectory = platformConfig.prompts_subdirectory;
        
        return path.join(basePath, promptsSubdirectory);
    }

    /**
     * Verify VS Code installation by checking if base directory exists
     */
    verifyVSCodeInstallation() {
        const platformConfig = this.config.platforms[this.platform];
        const basePath = this.expandEnvironmentVariables(platformConfig.base_path);
        
        return fs.existsSync(basePath);
    }

    /**
     * Get current platform name
     */
    getPlatform() {
        return this.platform;
    }
}

module.exports = Platform;
