#!/usr/bin/env node

const path = require('path');
const Platform = require('./lib/platform');
const HardLink = require('./lib/hardlink');
const FileOperations = require('./lib/file-operations');

/**
 * Cross-platform VS Code instructions sync script
 * Creates hard links between repository instructions and VS Code user directory
 */
class InstructionsSync {
    constructor() {
        this.repositoryRoot = FileOperations.getRepositoryRoot(__dirname);
        this.sourceDirectory = path.join(this.repositoryRoot, 'instructions');
        this.configurationFile = path.join(__dirname, 'config', 'vscode-paths.json');
        this.platform = new Platform(this.configurationFile);
    }

    /**
     * Find all .md files in the instructions directory
     */
    findInstructionFiles() {
        const files = FileOperations.findFilesByExtension(this.sourceDirectory, '.md');
        const targetDirectory = this.platform.getVSCodePromptsDirectory();
        
        return FileOperations.createFileMappings(
            this.sourceDirectory, 
            targetDirectory, 
            files
        );
    }

    /**
     * Main sync process
     */
    run() {
        console.log('🚀 Syncing VS Code instructions...');
        console.log(`Platform: ${this.platform.getPlatform()}`);
        console.log(`Repository: ${this.repositoryRoot}`);
        
        // Verify VS Code installation
        if (!this.platform.verifyVSCodeInstallation()) {
            console.log('⚠️  VS Code directory not found - creating target directory anyway.');
        }

        // Get target directory
        const targetDirectory = this.platform.getVSCodePromptsDirectory();
        console.log(`Target directory: ${targetDirectory}`);

        // Ensure target directory exists
        const dirResult = FileOperations.ensureDirectoryExists(targetDirectory);
        if (!dirResult.success) {
            console.error(`❌ Failed to create target directory: ${dirResult.error}`);
            process.exit(1);
        }
        
        if (dirResult.created) {
            console.log(`Created target directory: ${targetDirectory}`);
        }

        // Find instruction files
        const instructionFiles = this.findInstructionFiles();
        if (instructionFiles.length === 0) {
            console.log('ℹ️  No instruction files found in source directory');
            console.log(`Source directory: ${this.sourceDirectory}`);
            return;
        }

        console.log(`\n📁 Found ${instructionFiles.length} instruction file(s):`);
        
        // Create hard links
        const results = HardLink.createMultiple(instructionFiles);
        
        let successfulLinks = 0;
        let failedLinks = 0;

        for (const result of results) {
            console.log(`\n🔗 Linking: ${result.filename}`);
            console.log(`   Source: ${result.source}`);
            console.log(`   Target: ${result.target}`);

            if (result.success) {
                console.log('   ✅ Success');
                successfulLinks++;
            } else {
                console.log(`   ❌ Failed: ${result.error}`);
                failedLinks++;
            }
        }

        // Summary
        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Successful links: ${successfulLinks}`);
        console.log(`   ❌ Failed links: ${failedLinks}`);

        if (failedLinks > 0) {
            console.log('\n⚠️  Some files failed to link. Check error messages above.');
            process.exit(1);
        } else {
            console.log('\n🎉 All instructions successfully linked!');
            console.log('Your VS Code instructions are now synchronized with this repository.');
        }
    }
}

// Run the sync if this script is executed directly
if (require.main === module) {
    const sync = new InstructionsSync();
    sync.run();
}

module.exports = InstructionsSync;
