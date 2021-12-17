"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathResolver = void 0;
const fs = require("fs");
const path = require("path");
class PathResolver {
    static getprogramFiles() {
        switch (process.platform) {
            case 'win32':
                // eslint-disable-next-line no-case-declarations
                let programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
                if (process.env['PROCESSOR_ARCHITEW6432'] === 'AMD64') {
                    programFiles = process.env['ProgramW6432'] || 'C:\\Program Files';
                }
                return programFiles;
            default:
                return '/opt';
        }
    }
    static resolveSubDirectory(rootDir, subDir) {
        const versionDir = path.join(rootDir, subDir);
        if (fs.existsSync(versionDir)) {
            return versionDir;
        }
        else {
            const subdir = PathResolver.getDirectories(rootDir)[1];
            return subdir;
        }
    }
    static getDirectories(parent) {
        return fs.readdirSync(parent).filter(function (file) {
            return fs.statSync(path.join(parent, file)).isDirectory();
        });
    }
    static pathEnvSeparator() {
        if (process.platform === 'win32') {
            return ';';
        }
        else {
            return ':';
        }
    }
}
exports.PathResolver = PathResolver;
//# sourceMappingURL=pathResolver.js.map