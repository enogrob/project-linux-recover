'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogger = void 0;
const fs = require("fs");
class FileLogger {
    constructor(filename) {
        this.logwriter = fs.createWriteStream(filename);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    show() { }
    verbose(message) {
        this.emitMessage('VERBOSE', message);
    }
    debug(message) {
        this.emitMessage('DEBUG', message);
    }
    normal(message) {
        this.emitMessage('NORMAL', message);
    }
    warning(message) {
        this.emitMessage('WARNING', message);
    }
    error(message) {
        this.emitMessage('ERROR', message);
    }
    emitMessage(severity, message) {
        if (this.logwriter.writable) {
            this.logwriter.write(severity + ': ' + message + '\n');
        }
    }
}
exports.FileLogger = FileLogger;
//# sourceMappingURL=file.js.map