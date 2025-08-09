#!/usr/bin/env node

const fs = require('fs');

/**
 * Hard linking utilities
 */
class HardLink {
    /**
     * Create hard link from source to target
     */
    static create(sourcePath, targetPath) {
        try {
            // Remove existing target file if it exists
            if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
            }

            // Create hard link
            fs.linkSync(sourcePath, targetPath);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    /**
     * Check if two files are hard linked (same inode)
     */
    static areLinked(path1, path2) {
        try {
            if (!fs.existsSync(path1) || !fs.existsSync(path2)) {
                return false;
            }

            const stat1 = fs.statSync(path1);
            const stat2 = fs.statSync(path2);
            
            return stat1.dev === stat2.dev && stat1.ino === stat2.ino;
        } catch (error) {
            return false;
        }
    }

    /**
     * Create multiple hard links from file mapping
     */
    static createMultiple(fileMappings) {
        const results = [];
        
        for (const mapping of fileMappings) {
            const result = this.create(mapping.source, mapping.target);
            results.push({
                ...mapping,
                ...result
            });
        }
        
        return results;
    }
}

module.exports = HardLink;
