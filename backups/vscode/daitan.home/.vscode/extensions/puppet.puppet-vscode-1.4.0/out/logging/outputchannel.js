'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputChannelLogger = void 0;
const vscode = require("vscode");
const logging = require("../logging");
class OutputChannelLogger {
    constructor(logLevel) {
        this._logChannel = vscode.window.createOutputChannel('Puppet');
        if (logLevel === undefined) {
            this.minimumUserLogLevel = logging.LogLevel.Normal;
        }
        else {
            this.minimumUserLogLevel = this.logLevelFromString(logLevel);
        }
    }
    get logChannel() {
        return this._logChannel;
    }
    show() {
        this._logChannel.show();
    }
    verbose(message) {
        this.logWithLevel(logging.LogLevel.Verbose, message);
    }
    debug(message) {
        this.logWithLevel(logging.LogLevel.Debug, message);
    }
    normal(message) {
        this.logWithLevel(logging.LogLevel.Normal, message);
    }
    warning(message) {
        this.logWithLevel(logging.LogLevel.Warning, message);
    }
    error(message) {
        this.logWithLevel(logging.LogLevel.Error, message);
    }
    logWithLevel(level, message) {
        const logMessage = this.logLevelPrefixAsString(level) + new Date().toISOString() + ' ' + message;
        if (level >= this.minimumUserLogLevel) {
            this._logChannel.appendLine(logMessage);
        }
    }
    logLevelFromString(logLevelName) {
        switch (logLevelName.toLowerCase()) {
            case 'verbose':
                return logging.LogLevel.Verbose;
            case 'debug':
                return logging.LogLevel.Debug;
            case 'normal':
                return logging.LogLevel.Normal;
            case 'warning':
                return logging.LogLevel.Warning;
            case 'error':
                return logging.LogLevel.Error;
            default:
                return logging.LogLevel.Error;
        }
    }
    logLevelPrefixAsString(level) {
        switch (level) {
            case logging.LogLevel.Verbose:
                return 'VERBOSE: ';
            case logging.LogLevel.Debug:
                return 'DEBUG: ';
            case logging.LogLevel.Warning:
                return 'WARNING: ';
            case logging.LogLevel.Error:
                return 'ERROR: ';
            default:
                return '';
        }
    }
}
exports.OutputChannelLogger = OutputChannelLogger;
//# sourceMappingURL=outputchannel.js.map