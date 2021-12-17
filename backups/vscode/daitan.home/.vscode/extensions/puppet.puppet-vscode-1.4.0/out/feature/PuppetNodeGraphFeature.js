"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppetNodeGraphFeature = void 0;
const path = require("path");
const vscode = require("vscode");
const interfaces_1 = require("../interfaces");
const messages_1 = require("../messages");
const settings_1 = require("../settings");
const telemetry_1 = require("../telemetry");
const PuppetNodeGraphToTheSideCommandId = 'puppet.puppetShowNodeGraphToSide';
class PuppetNodeGraphFeature {
    constructor(puppetLangID, handler, logger, context) {
        this.puppetLangID = puppetLangID;
        this.handler = handler;
        this.logger = logger;
        this.context = context;
        this.providers = undefined;
        this.providers = [];
        context.subscriptions.push(vscode.commands.registerCommand(PuppetNodeGraphToTheSideCommandId, () => {
            if (!vscode.window.activeTextEditor) {
                return;
            }
            if (vscode.window.activeTextEditor.document.languageId !== this.puppetLangID) {
                return;
            }
            if (this.handler.status !== interfaces_1.ConnectionStatus.RunningLoaded &&
                this.handler.status !== interfaces_1.ConnectionStatus.RunningLoading) {
                vscode.window.showInformationMessage('The Puppet Node Graph Preview is not available as the Editor Service is not ready. Please try again.');
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const provider = new NodeGraphWebViewProvider(vscode.window.activeTextEditor.document.uri, handler, logger, context);
            this.providers.push(provider);
            provider.show();
        }));
        logger.debug('Registered command for node graph event handler');
        context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document) => {
            // Subscribe to save events and fire updates
            this.providers.forEach((item) => {
                if (document.uri === vscode.window.activeTextEditor.document.uri) {
                    item.show(true);
                }
            });
        }));
        logger.debug('Registered onDidSaveTextDocument for node graph event handler');
    }
    dispose() {
        this.providers.forEach((p) => {
            p.dispose();
        });
    }
}
exports.PuppetNodeGraphFeature = PuppetNodeGraphFeature;
class NodeGraphWebViewProvider {
    constructor(resource, connectionHandler, logger, context) {
        this.resource = resource;
        this.connectionHandler = connectionHandler;
        this.logger = logger;
        this.context = context;
        this.panel = undefined;
        const fileName = path.basename(resource.fsPath);
        this.panel = vscode.window.createWebviewPanel('puppetNodeGraph', // Identifies the type of the webview. Used internally
        `Node Graph '${fileName}'`, // Title of the panel displayed to the user
        vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
        { enableScripts: true });
        this.panel.webview.html = this.getHtml(this.context.extensionPath);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.panel.onDidDispose(() => { });
        this.panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'error':
                    vscode.window.showErrorMessage(message.errorMsg);
                    break;
                case 'warning':
                    vscode.window.showWarningMessage(message.errorMsg);
                    break;
                default:
                    break;
            }
        });
    }
    show(redraw = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationType = this.getNotificationType();
            if (notificationType === undefined) {
                return this.connectionHandler.languageClient
                    .sendRequest(messages_1.PuppetNodeGraphRequest.type, {
                    external: this.resource.toString(),
                })
                    .then((compileResult) => {
                    this.getJsonContent(compileResult, redraw);
                });
            }
            else {
                vscode.window.withProgress({
                    location: notificationType,
                    title: 'Puppet',
                    cancellable: false,
                }, (progress) => {
                    progress.report({ message: 'Generating New Node Graph' });
                    return this.connectionHandler.languageClient
                        .sendRequest(messages_1.PuppetNodeGraphRequest.type, {
                        external: this.resource.toString(),
                    })
                        .then((compileResult) => {
                        this.getJsonContent(compileResult, redraw);
                    });
                });
            }
        });
    }
    dispose() {
        this.panel.dispose();
    }
    getJsonContent(compileResult, redraw) {
        if (compileResult === undefined) {
            vscode.window.showErrorMessage('Invalid data returned from manifest. Cannot build node graph');
            return;
        }
        if (compileResult.error) {
            vscode.window.showErrorMessage(compileResult.error);
            return;
        }
        if (telemetry_1.reporter) {
            telemetry_1.reporter.sendTelemetryEvent(PuppetNodeGraphToTheSideCommandId);
        }
        this.panel.webview.postMessage({
            content: compileResult,
            redraw: redraw,
        });
    }
    getNotificationType() {
        // Calculate where the progress message should go, if at all.
        const currentSettings = settings_1.SettingsFromWorkspace();
        let notificationType = vscode.ProgressLocation.Notification;
        if (currentSettings.notification !== undefined && currentSettings.notification.nodeGraph !== undefined) {
            switch (currentSettings.notification.nodeGraph.toLowerCase()) {
                case 'messagebox':
                    notificationType = vscode.ProgressLocation.Notification;
                    break;
                case 'statusbar':
                    notificationType = vscode.ProgressLocation.Window;
                    break;
                case 'none':
                    notificationType = undefined;
                    break;
                default:
                    break; // Default is already set
            }
        }
        return notificationType;
    }
    getHtml(extensionPath) {
        const cytoPath = this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'vendor', 'cytoscape', 'cytoscape.min.js')));
        const mainScript = this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'assets', 'js', 'main.js')));
        const mainCss = this.panel.webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'assets', 'css', 'main.css')));
        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Puppet node graph</title>
<script src="${cytoPath}"></script>
<script src="${mainScript}"></script>
<link href="${mainCss}" rel="stylesheet" type="text/css" />
</head>
<body>
<div id="cy"></div>
<script>
init()
</script>
</body>
</html>
`;
        return html;
    }
}
//# sourceMappingURL=PuppetNodeGraphFeature.js.map