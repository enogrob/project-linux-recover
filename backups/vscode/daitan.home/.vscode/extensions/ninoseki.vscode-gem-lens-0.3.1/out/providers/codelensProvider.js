"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodelensProvider = void 0;
const vscode_1 = require("vscode");
const commandFactory_1 = require("../factories/commandFactory");
class CodelensProvider {
    constructor() {
        this.codeLenses = [];
        this._onDidChangeCodeLenses = new vscode_1.EventEmitter();
        this.onDidChangeCodeLenses = this
            ._onDidChangeCodeLenses.event;
        this.regex = /\w+\.(add_development_dependency|add_runtime_dependency|add_dependency)/g;
        vscode_1.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }
    async provideCodeLenses(document, token) {
        this.codeLenses = [];
        const text = document.getText();
        const regex = new RegExp(this.regex);
        let matches;
        while ((matches = regex.exec(text)) !== null) {
            const line = document.lineAt(document.positionAt(matches.index).line);
            const lineText = line.text.trim();
            const indexOf = line.text.indexOf(matches[0]);
            const position = new vscode_1.Position(line.lineNumber, indexOf);
            const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
            if (range) {
                const command = await commandFactory_1.createCommand(lineText);
                if (command !== undefined) {
                    this.codeLenses.push(new vscode_1.CodeLens(range, command));
                }
            }
        }
        return this.codeLenses;
    }
}
exports.CodelensProvider = CodelensProvider;
//# sourceMappingURL=codelensProvider.js.map