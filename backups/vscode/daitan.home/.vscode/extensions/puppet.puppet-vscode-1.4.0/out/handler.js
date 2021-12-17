"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionHandler = void 0;
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const interfaces_1 = require("./interfaces");
const messages_1 = require("./messages");
const telemetry_1 = require("./telemetry");
const extension_1 = require("./extension");
class ConnectionHandler {
    constructor(context, statusBar, logger, config) {
        this.context = context;
        this.statusBar = statusBar;
        this.logger = logger;
        this.config = config;
        this.timeSpent = Date.now();
        this.setConnectionStatus('Initializing', interfaces_1.ConnectionStatus.Initializing);
        const documents = [
            { scheme: 'file', language: extension_1.puppetLangID },
            { scheme: 'file', language: extension_1.puppetFileLangID },
        ];
        this.logger.debug('Configuring language client options');
        const clientOptions = {
            documentSelector: documents,
            outputChannel: this.logger.logChannel,
            revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Info,
        };
        this.logger.debug('Creating server options');
        const serverOptions = this.createServerOptions();
        this.logger.debug('Creating language client');
        this._languageClient = new vscode_languageclient_1.LanguageClient('PuppetVSCode', serverOptions, clientOptions);
        this._languageClient
            .onReady()
            .then(() => {
            this.languageClient.onTelemetry((event) => {
                const eventName = event.Name ? event.Name : 'PUPPET_LANGUAGESERVER_EVENT';
                telemetry_1.reporter.sendTelemetryEvent(eventName, event.Measurements, event.Properties);
            });
            this.setConnectionStatus('Loading Puppet', interfaces_1.ConnectionStatus.Starting);
            this.queryLanguageServerStatusWithProgress();
        }, (reason) => {
            this.setConnectionStatus('Starting error', interfaces_1.ConnectionStatus.Starting);
            this.languageClient.error(reason);
            telemetry_1.reporter.sendTelemetryException(reason);
        })
            .catch((reason) => {
            this.setConnectionStatus('Failure', interfaces_1.ConnectionStatus.Failed);
            telemetry_1.reporter.sendTelemetryException(reason);
        });
        this.setConnectionStatus('Initialization Complete', interfaces_1.ConnectionStatus.InitializationComplete);
        this.context.subscriptions.push(vscode.commands.registerCommand(messages_1.PuppetCommandStrings.PuppetShowConnectionLogsCommandId, () => {
            this.logger.show();
        }));
    }
    get status() {
        return this._status;
    }
    get languageClient() {
        return this._languageClient;
    }
    get protocolType() {
        return this.config.workspace.editorService.protocol;
    }
    start() {
        this.setConnectionStatus('Starting languageserver', interfaces_1.ConnectionStatus.Starting, '');
        this.context.subscriptions.push(this.languageClient.start());
    }
    stop() {
        this.setConnectionStatus('Stopping languageserver', interfaces_1.ConnectionStatus.Stopping, '');
        if (this.languageClient !== undefined) {
            this.timeSpent = Date.now() - this.timeSpent;
            this._languageClient.sendRequest(messages_1.PuppetVersionRequest.type).then((versionDetails) => {
                telemetry_1.reporter.sendTelemetryEvent('data', {
                    timeSpent: this.timeSpent.toString(),
                    puppetVersion: versionDetails.puppetVersion,
                    facterVersion: versionDetails.facterVersion,
                    languageServerVersion: versionDetails.languageServerVersion,
                });
            });
            this.languageClient.stop();
        }
        this.logger.debug('Running cleanup');
        this.cleanup();
        this.setConnectionStatus('Stopped languageserver', interfaces_1.ConnectionStatus.Stopped, '');
    }
    setConnectionStatus(message, status, toolTip) {
        this._status = status;
        this.statusBar.setConnectionStatus(message, status, toolTip);
    }
    queryLanguageServerStatusWithProgress() {
        return new Promise((resolve, reject) => {
            let count = 0;
            let lastVersionResponse;
            const handle = setInterval(() => {
                count++;
                // After 30 seonds timeout the progress
                if (count >= 30 || this._languageClient === undefined) {
                    clearInterval(handle);
                    this.setConnectionStatus(lastVersionResponse.puppetVersion, interfaces_1.ConnectionStatus.RunningLoaded, '');
                    resolve();
                    return;
                }
                this._languageClient.sendRequest(messages_1.PuppetVersionRequest.type).then((versionDetails) => {
                    lastVersionResponse = versionDetails;
                    if (versionDetails.factsLoaded &&
                        versionDetails.functionsLoaded &&
                        versionDetails.typesLoaded &&
                        versionDetails.classesLoaded) {
                        clearInterval(handle);
                        this.setConnectionStatus(lastVersionResponse.puppetVersion, interfaces_1.ConnectionStatus.RunningLoaded, '');
                        resolve();
                    }
                    else {
                        let toolTip = '';
                        toolTip += versionDetails.classesLoaded ? '✔ Classes: Loaded\n' : '⏳ Classes: Loading...\n';
                        toolTip += versionDetails.factsLoaded ? '✔ Facts: Loaded\n' : '⏳ Facts: Loading...\n';
                        toolTip += versionDetails.functionsLoaded ? '✔ Functions: Loaded\n' : '⏳ Functions: Loading...\n';
                        toolTip += versionDetails.typesLoaded ? '✔ Types: Loaded' : '⏳ Types: Loading...';
                        this.setConnectionStatus(lastVersionResponse.puppetVersion, interfaces_1.ConnectionStatus.RunningLoading, toolTip);
                    }
                });
            }, 1000);
        });
    }
}
exports.ConnectionHandler = ConnectionHandler;
//# sourceMappingURL=handler.js.map