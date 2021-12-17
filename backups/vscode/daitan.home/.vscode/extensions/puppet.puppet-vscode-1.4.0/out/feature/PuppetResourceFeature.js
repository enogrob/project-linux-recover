'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppetResourceFeature = void 0;
const vscode = require("vscode");
const interfaces_1 = require("../interfaces");
const messages_1 = require("../messages");
const settings_1 = require("../settings");
const telemetry_1 = require("../telemetry");
class PuppetResourceFeature {
    constructor(context, connMgr, logger) {
        this.logger = logger;
        this._connectionHandler = connMgr;
        context.subscriptions.push(vscode.commands.registerCommand(messages_1.PuppetCommandStrings.PuppetResourceCommandId, () => {
            this.run();
        }));
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispose() { }
    run() {
        if (this._connectionHandler.status !== interfaces_1.ConnectionStatus.RunningLoaded) {
            vscode.window.showInformationMessage('Puppet Resource is not available as the Language Server is not ready');
            return;
        }
        this.pickPuppetResource().then((moduleName) => {
            if (moduleName) {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return;
                }
                const doc = editor.document;
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                const requestParams = new RequestParams();
                requestParams.typename = moduleName;
                // Calculate where the progress message should go, if at all.
                const currentSettings = settings_1.SettingsFromWorkspace();
                let notificationType = vscode.ProgressLocation.Notification;
                if (currentSettings.notification !== undefined && currentSettings.notification.puppetResource !== undefined) {
                    switch (currentSettings.notification.puppetResource.toLowerCase()) {
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
                if (notificationType !== undefined) {
                    vscode.window.withProgress({
                        location: notificationType,
                        title: 'Puppet',
                        cancellable: false,
                    }, (progress) => {
                        progress.report({ message: `Gathering Puppet ${moduleName} Resources` });
                        return this._connectionHandler.languageClient
                            .sendRequest(messages_1.PuppetResourceRequest.type, requestParams)
                            .then((resourceResult) => {
                            this.respsonseToVSCodeEdit(resourceResult, editor, doc);
                        });
                    });
                }
                else {
                    this._connectionHandler.languageClient
                        .sendRequest(messages_1.PuppetResourceRequest.type, requestParams)
                        .then((resourceResult) => {
                        this.respsonseToVSCodeEdit(resourceResult, editor, doc);
                    });
                }
            }
        });
    }
    respsonseToVSCodeEdit(resourceResult, editor, doc) {
        if (resourceResult.error !== undefined && resourceResult.error.length > 0) {
            this.logger.error(resourceResult.error);
            return;
        }
        if (resourceResult.data === undefined || resourceResult.data.length === 0) {
            return;
        }
        if (!editor) {
            return;
        }
        let newPosition = new vscode.Position(0, 0);
        if (editor.selection.isEmpty) {
            const position = editor.selection.active;
            newPosition = position.with(position.line, 0);
        }
        this.editCurrentDocument(doc.uri, resourceResult.data, newPosition);
        if (telemetry_1.reporter) {
            telemetry_1.reporter.sendTelemetryEvent(messages_1.PuppetCommandStrings.PuppetResourceCommandId);
        }
    }
    pickPuppetResource() {
        const options = {
            placeHolder: 'Enter a Puppet resource to interrogate',
            matchOnDescription: true,
            matchOnDetail: true,
        };
        return vscode.window.showInputBox(options);
    }
    editCurrentDocument(uri, text, position) {
        const edit = new vscode.WorkspaceEdit();
        edit.insert(uri, position, text);
        vscode.workspace.applyEdit(edit);
    }
}
exports.PuppetResourceFeature = PuppetResourceFeature;
class RequestParams {
}
//# sourceMappingURL=PuppetResourceFeature.js.map