#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generic file operations for sync scripts
 */
class FileOperations {
    /**
     * Ensure directory exists, create if necessary
     */
    static ensureDirectoryExists(directoryPath) {
        try {
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
                return { success: true, created: true };
            }
            return { success: true, created: false };
        } catch (error) {
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    /**
     * Find files in directory matching extension pattern
     */
    static findFilesByExtension(sourceDirectory, extensionPattern) {
        try {
            if (!fs.existsSync(sourceDirectory)) {
                return [];
            }

            const allFiles = fs.readdirSync(sourceDirectory);
            return allFiles.filter(filename => 
                filename.endsWith(extensionPattern)
            );
        } catch (error) {
            console.error(`Error finding files: ${error.message}`);
            return [];
        }
    }

    /**
     * Create file mapping for sync operations
     */
    static createFileMappings(sourceDirectory, targetDirectory, files) {
        return files.map(filename => ({
            filename: filename,
            source: path.join(sourceDirectory, filename),
            target: path.join(targetDirectory, filename)
        }));
    }

    /**
     * Get repository root directory by searching upwards for a marker file (package.json or .git)
     */
    static getRepositoryRoot(startPath) {
        let currentDir = path.dirname(startPath);
        const rootDir = path.parse(currentDir).root;
        while (currentDir !== rootDir) {
            if (fs.existsSync(path.join(currentDir, 'package.json')) || fs.existsSync(path.join(currentDir, '.git'))) {
                return currentDir;
            }
            currentDir = path.dirname(currentDir);
        }
        return null; // Could not find repo root
    }
}

module.exports = FileOperations;
