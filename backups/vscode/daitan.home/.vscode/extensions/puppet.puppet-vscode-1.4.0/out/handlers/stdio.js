"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdioConnectionHandler = void 0;
const handler_1 = require("../handler");
const commandHelper_1 = require("../helpers/commandHelper");
const settings_1 = require("../settings");
class StdioConnectionHandler extends handler_1.ConnectionHandler {
    get connectionType() {
        return settings_1.ConnectionType.Local;
    }
    constructor(context, statusBar, logger, config) {
        super(context, statusBar, logger, config);
        this.logger.debug(`Configuring ${settings_1.ConnectionType[this.connectionType]}::${this.protocolType} connection handler`);
        this.start();
    }
    createServerOptions() {
        const exe = commandHelper_1.CommandEnvironmentHelper.getLanguageServerRubyEnvFromConfiguration(this.context.asAbsolutePath(this.config.ruby.languageServerPath), this.config);
        let logPrefix = '';
        // eslint-disable-next-line default-case
        switch (this.config.workspace.installType) {
            case settings_1.PuppetInstallType.PDK:
                logPrefix = '[getRubyEnvFromPDK] ';
                this.logger.debug(logPrefix + 'Using environment variable DEVKIT_BASEDIR=' + exe.options.env.DEVKIT_BASEDIR);
                this.logger.debug(logPrefix + 'Using environment variable GEM_HOME=' + exe.options.env.GEM_HOME);
                this.logger.debug(logPrefix + 'Using environment variable GEM_PATH=' + exe.options.env.GEM_PATH);
                break;
            case settings_1.PuppetInstallType.PUPPET:
                logPrefix = '[getRubyExecFromPuppetAgent] ';
                this.logger.debug(logPrefix + 'Using environment variable SSL_CERT_FILE=' + exe.options.env.SSL_CERT_FILE);
                this.logger.debug(logPrefix + 'Using environment variable SSL_CERT_DIR=' + exe.options.env.SSL_CERT_DIR);
                break;
        }
        this.logger.debug(logPrefix + 'Using environment variable RUBY_DIR=' + exe.options.env.RUBY_DIR);
        this.logger.debug(logPrefix + 'Using environment variable RUBYLIB=' + exe.options.env.RUBYLIB);
        this.logger.debug(logPrefix + 'Using environment variable PATH=' + exe.options.env.PATH);
        this.logger.debug(logPrefix + 'Using environment variable RUBYOPT=' + exe.options.env.RUBYOPT);
        this.logger.debug(logPrefix + 'Editor Services will invoke with: ' + exe.command + ' ' + exe.args.join(' '));
        const serverOptions = {
            run: exe,
            debug: exe,
        };
        return serverOptions;
    }
    cleanup() {
        this.logger.debug(`No cleanup needed for ${this.protocolType}`);
    }
}
exports.StdioConnectionHandler = StdioConnectionHandler;
//# sourceMappingURL=stdio.js.map