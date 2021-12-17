"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpConnectionHandler = void 0;
const cp = require("child_process");
const net = require("net");
const handler_1 = require("../handler");
const commandHelper_1 = require("../helpers/commandHelper");
const settings_1 = require("../settings");
class TcpConnectionHandler extends handler_1.ConnectionHandler {
    constructor(context, statusBar, logger, config) {
        super(context, statusBar, logger, config);
        this.logger.debug(`Configuring ${settings_1.ConnectionType[this.connectionType]}::${this.protocolType} connection handler`);
        if (this.connectionType === settings_1.ConnectionType.Local) {
            const exe = commandHelper_1.CommandEnvironmentHelper.getLanguageServerRubyEnvFromConfiguration(this.context.asAbsolutePath(this.config.ruby.languageServerPath), this.config);
            let logPrefix = '';
            // eslint-disable-next-line default-case
            switch (this.config.workspace.installType) {
                case settings_1.PuppetInstallType.PDK:
                    logPrefix = '[getRubyEnvFromPDK] ';
                    break;
                case settings_1.PuppetInstallType.PUPPET:
                    logPrefix = '[getRubyExecFromPuppetAgent] ';
                    break;
            }
            this.logger.debug(logPrefix + 'Using environment variable RUBY_DIR=' + exe.options.env.RUBY_DIR);
            this.logger.debug(logPrefix + 'Using environment variable PATH=' + exe.options.env.PATH);
            this.logger.debug(logPrefix + 'Using environment variable RUBYLIB=' + exe.options.env.RUBYLIB);
            this.logger.debug(logPrefix + 'Using environment variable RUBYOPT=' + exe.options.env.RUBYOPT);
            this.logger.debug(logPrefix + 'Using environment variable SSL_CERT_FILE=' + exe.options.env.SSL_CERT_FILE);
            this.logger.debug(logPrefix + 'Using environment variable SSL_CERT_DIR=' + exe.options.env.SSL_CERT_DIR);
            this.logger.debug(logPrefix + 'Using environment variable GEM_PATH=' + exe.options.env.GEM_PATH);
            this.logger.debug(logPrefix + 'Using environment variable GEM_HOME=' + exe.options.env.GEM_HOME);
            const spawnOptions = {};
            const convertedOptions = Object.assign(spawnOptions, exe.options);
            this.logger.debug(logPrefix + 'Editor Services will invoke with: ' + exe.command + ' ' + exe.args.join(' '));
            const proc = cp.spawn(exe.command, exe.args, convertedOptions);
            proc.stdout.on('data', (data) => {
                if (/LANGUAGE SERVER RUNNING/.test(data.toString())) {
                    const p = data.toString().match(/LANGUAGE SERVER RUNNING.*:(\d+)/);
                    config.workspace.editorService.tcp.port = Number(p[1]);
                    this.start();
                }
            });
            proc.on('close', (exitCode) => {
                this.logger.debug('SERVER terminated with exit code: ' + exitCode);
            });
            if (!proc || !proc.pid) {
                throw new Error(`Launching server using command ${exe.command} failed.`);
            }
        }
        else {
            this.start();
        }
    }
    get connectionType() {
        switch (this.config.workspace.editorService.protocol) {
            case settings_1.ProtocolType.TCP:
                if (this.config.workspace.editorService.tcp.address === '127.0.0.1' ||
                    this.config.workspace.editorService.tcp.address === 'localhost' ||
                    this.config.workspace.editorService.tcp.address === '') {
                    return settings_1.ConnectionType.Local;
                }
                else {
                    return settings_1.ConnectionType.Remote;
                }
            default:
                // In this case we have no idea what the type is
                return undefined;
        }
    }
    createServerOptions() {
        this.logger.debug(`Starting language server client (host ${this.config.workspace.editorService.tcp.address} port ${this.config.workspace.editorService.tcp.port})`);
        const serverOptions = () => {
            const socket = new net.Socket();
            socket.connect({
                port: this.config.workspace.editorService.tcp.port,
                host: this.config.workspace.editorService.tcp.address,
            });
            const result = {
                writer: socket,
                reader: socket,
            };
            return Promise.resolve(result);
        };
        return serverOptions;
    }
    cleanup() {
        this.logger.debug(`No cleanup needed for ${this.protocolType}`);
    }
}
exports.TcpConnectionHandler = TcpConnectionHandler;
//# sourceMappingURL=tcp.js.map