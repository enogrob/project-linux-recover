/* eslint-disable */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebuggingFeature = exports.DebugConfigurationProvider = exports.DebugAdapterDescriptorFactory = void 0;
const cp = require("child_process");
const vscode = require("vscode");
const commandHelper_1 = require("../helpers/commandHelper");
// Socket vs Exec DebugAdapter types
// https://github.com/Microsoft/vscode/blob/2808feeaf6b24feaaa6ba49fb91ea165c4d5fb06/src/vs/workbench/parts/debug/node/debugger.ts#L58-L61
//
// DebugAdapterExecutable uses stdin/stdout
// https://github.com/Microsoft/vscode/blob/2808feeaf6b24feaaa6ba49fb91ea165c4d5fb06/src/vs/workbench/parts/debug/node/debugAdapter.ts#L305
//
// DebugAdapterServer uses tcp
// https://github.com/Microsoft/vscode/blob/2808feeaf6b24feaaa6ba49fb91ea165c4d5fb06/src/vs/workbench/parts/debug/node/debugAdapter.ts#L256
class DebugAdapterDescriptorFactory {
    constructor(context, config, logger) {
        this.ChildProcesses = [];
        this.Context = context;
        this.Config = config;
        this.Logger = logger;
    }
    createDebugAdapterDescriptor(session, executable) {
        // Right now we don't care about session as we only have one type of adapter, which is launch.  When
        // we add the ability to attach to a debugger remotely we'll need to switch scenarios based on `session`
        const thisFactory = this;
        return new Promise(function (resolve, reject) {
            const debugServer = commandHelper_1.CommandEnvironmentHelper.getDebugServerRubyEnvFromConfiguration(thisFactory.Context.asAbsolutePath(thisFactory.Config.ruby.debugServerPath), thisFactory.Config);
            const spawn_options = {};
            spawn_options.env = debugServer.options.env;
            spawn_options.stdio = 'pipe';
            if (process.platform !== 'win32') {
                spawn_options.shell = true;
            }
            thisFactory.Logger.verbose('Starting the Debug Server with ' + debugServer.command + ' ' + debugServer.args.join(' '));
            const debugServerProc = cp.spawn(debugServer.command, debugServer.args, spawn_options);
            thisFactory.ChildProcesses.push(debugServerProc);
            let debugSessionRunning = false;
            debugServerProc.stdout.on('data', (data) => {
                thisFactory.Logger.debug('Debug Server STDOUT: ' + data.toString());
                // If the debug client isn't already running and it's sent the trigger text, start up a client
                if (!debugSessionRunning && data.toString().match('DEBUG SERVER RUNNING') !== null) {
                    debugSessionRunning = true;
                    const p = data.toString().match(/DEBUG SERVER RUNNING (.*):(\d+)/);
                    if (p === null) {
                        reject('Debug Server started but unable to parse hostname and port');
                    }
                    else {
                        thisFactory.Logger.debug('Starting Debug Client connection to ' + p[1] + ':' + p[2]);
                        resolve(new vscode.DebugAdapterServer(Number(p[2]), p[1]));
                    }
                }
            });
            debugServerProc.on('error', (data) => {
                thisFactory.Logger.error('Debug Srver errored with ' + data);
                reject('Spawning Debug Server failed with ' + data);
            });
            debugServerProc.on('close', (exitCode) => {
                thisFactory.Logger.verbose('Debug Server exited with exitcode ' + exitCode);
            });
        });
    }
    dispose() {
        this.ChildProcesses.forEach((item) => {
            item.kill('SIGHUP');
        });
        this.ChildProcesses = [];
        return undefined;
    }
}
exports.DebugAdapterDescriptorFactory = DebugAdapterDescriptorFactory;
class DebugConfigurationProvider {
    constructor(debugType, logger, context) {
        this.debugType = debugType;
        this.logger = logger;
        this.context = context;
    }
    provideDebugConfigurations(folder, token) {
        return [this.createLaunchConfigFromContext(folder)];
    }
    resolveDebugConfiguration(folder, debugConfiguration, token) {
        return debugConfiguration;
    }
    createLaunchConfigFromContext(folder) {
        const config = {
            type: this.debugType,
            request: 'launch',
            name: 'Puppet Apply current file',
            manifest: '${file}',
            args: [],
            noop: true,
            cwd: '${file}',
        };
        return config;
    }
}
exports.DebugConfigurationProvider = DebugConfigurationProvider;
class DebuggingFeature {
    constructor(debugType, config, context, logger) {
        this.factory = new DebugAdapterDescriptorFactory(context, config, logger);
        this.provider = new DebugConfigurationProvider(debugType, logger, context);
        logger.debug('Registered DebugAdapterDescriptorFactory for ' + debugType);
        context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory(debugType, this.factory));
        context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(debugType, this.provider));
        logger.debug('Registered DebugConfigurationProvider for ' + debugType);
    }
    dispose() {
        if (this.factory !== null) {
            this.factory.dispose();
            this.factory = null;
        }
    }
}
exports.DebuggingFeature = DebuggingFeature;
//# sourceMappingURL=DebuggingFeature.js.map