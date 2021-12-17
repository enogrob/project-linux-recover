'use strict';
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
exports.FormatDocumentFeature = void 0;
const vscode = require("vscode");
const interfaces_1 = require("../interfaces");
const messages = require("../messages");
const telemetry_1 = require("../telemetry");
class RequestParams {
}
class FormatDocumentProvider {
    constructor(connectionManager) {
        this.connectionHandler = undefined;
        this.connectionHandler = connectionManager;
    }
    formatTextEdits(document, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionHandler.status !== interfaces_1.ConnectionStatus.RunningLoaded &&
                this.connectionHandler.status !== interfaces_1.ConnectionStatus.RunningLoading) {
                vscode.window.showInformationMessage('Please wait and try again. The Puppet extension is still loading...');
                return [];
            }
            if (telemetry_1.reporter) {
                telemetry_1.reporter.sendTelemetryEvent('puppet/FormatDocument');
            }
            const requestParams = new RequestParams();
            requestParams.documentUri = document.uri.toString(false);
            requestParams.alwaysReturnContent = false;
            const result = (yield this.connectionHandler.languageClient.sendRequest(messages.PuppetFixDiagnosticErrorsRequest.type, requestParams));
            if (result.fixesApplied > 0 && result.newContent !== undefined) {
                return [vscode.TextEdit.replace(new vscode.Range(0, 0, document.lineCount, 0), result.newContent)];
            }
            return [];
        });
    }
}
class FormatDocumentFeature {
    constructor(langID, connectionManager, config, logger, context) {
        this.provider = new FormatDocumentProvider(connectionManager);
        if (config.workspace.format.enable === true) {
            logger.debug('Registered Format Document provider');
            context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(langID, {
                provideDocumentFormattingEdits: (document, options, token) => {
                    return this.provider.formatTextEdits(document, options);
                },
            }));
        }
        else {
            logger.debug('Format Document provider has not been registered');
        }
    }
    dispose() {
        return undefined;
    }
}
exports.FormatDocumentFeature = FormatDocumentFeature;
//# sourceMappingURL=FormatDocumentFeature.js.map