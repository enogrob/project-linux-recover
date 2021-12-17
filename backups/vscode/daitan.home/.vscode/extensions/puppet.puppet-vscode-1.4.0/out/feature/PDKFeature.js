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
exports.PDKFeature = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
class PDKFeature {
    constructor(context, logger) {
        this.terminal = vscode.window.createTerminal('Puppet PDK');
        this.terminal.processId.then((pid) => {
            logger.debug('pdk shell started, pid: ' + pid);
        });
        context.subscriptions.push(this.terminal);
        context.subscriptions.push(vscode.commands.registerCommand(messages_1.PDKCommandStrings.PdkNewModuleCommandId, () => {
            this.pdkNewModuleCommand();
        }));
        logger.debug('Registered ' + messages_1.PDKCommandStrings.PdkNewModuleCommandId + ' command');
        // commands that require no user input
        [
            { id: 'extension.pdkValidate', request: 'pdk validate', type: 'validate' },
            { id: 'extension.pdkTestUnit', request: 'pdk test unit', type: 'test' },
        ].forEach((command) => {
            context.subscriptions.push(vscode.commands.registerCommand(command.id, () => {
                this.terminal.sendText(command.request);
                this.terminal.show();
                if (telemetry_1.reporter) {
                    telemetry_1.reporter.sendTelemetryEvent(command.id);
                }
            }));
            logger.debug(`Registered ${command.id} command`);
        });
        // commands that require user input
        [
            { id: 'extension.pdkNewClass', request: 'pdk new class', type: 'Puppet class' },
            { id: 'extension.pdkNewTask', request: 'pdk new task', type: 'Bolt task' },
            { id: 'extension.pdkNewDefinedType', request: 'pdk new defined_type', type: 'Puppet defined_type' },
            { id: 'extension.pdkNewFact', request: 'pdk new fact', type: 'Puppet Fact' },
            { id: 'extension.pdkNewFunction', request: 'pdk new function', type: 'Puppet Function' },
        ].forEach((command) => {
            context.subscriptions.push(vscode.commands.registerCommand(command.id, () => __awaiter(this, void 0, void 0, function* () {
                const name = yield vscode.window.showInputBox({
                    prompt: `Enter a name for the new ${command.type}`,
                });
                if (name === undefined) {
                    vscode.window.showWarningMessage('No module name specifed. Exiting.');
                    return;
                }
                const request = `${command.request} ${name}`;
                this.terminal.sendText(request);
                this.terminal.show();
                if (telemetry_1.reporter) {
                    telemetry_1.reporter.sendTelemetryEvent(command.id);
                }
            })));
            logger.debug(`Registered ${command.id} command`);
        });
    }
    dispose() {
        this.terminal.dispose();
    }
    pdkNewModuleCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            const name = yield vscode.window.showInputBox({
                prompt: 'Enter a name for the new Puppet module',
            });
            if (name === undefined) {
                vscode.window.showWarningMessage('No module name specifed. Exiting.');
                return;
            }
            const directory = yield vscode.window.showOpenDialog({
                canSelectMany: false,
                canSelectFiles: false,
                canSelectFolders: true,
                openLabel: 'Choose the path for the new Puppet module',
            });
            if (directory === undefined) {
                vscode.window.showWarningMessage('No directory specifed. Exiting.');
                return;
            }
            const p = path.join(directory[0].fsPath, name);
            this.terminal.sendText(`pdk new module --skip-interview ${name} ${p}`);
            this.terminal.show();
            yield new Promise((resolve) => {
                let count = 0;
                const handle = setInterval(() => {
                    count++;
                    if (count >= 30) {
                        clearInterval(handle);
                        resolve();
                        return;
                    }
                    if (fs.existsSync(p)) {
                        resolve();
                        return;
                    }
                }, 1000);
            });
            const uri = vscode.Uri.file(p);
            yield vscode.commands.executeCommand('vscode.openFolder', uri);
            if (telemetry_1.reporter) {
                telemetry_1.reporter.sendTelemetryEvent(messages_1.PDKCommandStrings.PdkNewModuleCommandId);
            }
        });
    }
}
exports.PDKFeature = PDKFeature;
//# sourceMappingURL=PDKFeature.js.map