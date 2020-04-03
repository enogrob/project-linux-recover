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
const vscode = require("vscode");
const vscode_extension_common_1 = require("vscode-extension-common");
const fold = require("./Fold");
function activate(context) {
    let disposable = vscode.commands.registerCommand('dakara-foldplus.levelAtCursor', () => {
        warnFoldStrategy();
        fold.foldLevelOfCursor();
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('dakara-foldplus.levelOfParent', () => {
        warnFoldStrategy();
        fold.foldLevelOfParent();
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('dakara-foldplus.children', () => {
        warnFoldStrategy();
        fold.foldChildren();
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('dakara-foldplus.parent', () => {
        warnFoldStrategy();
        const textEditor = vscode.window.activeTextEditor;
        const parentLine = vscode_extension_common_1.Lines.findNextLineUpSpacedLeft(textEditor.document, textEditor.selection.active.line, +textEditor.options.tabSize);
        textEditor.selection = new vscode.Selection(parentLine.lineNumber, 0, parentLine.lineNumber, 0);
        vscode.commands.executeCommand('editor.fold');
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('dakara-foldplus.selection', () => {
        warnFoldStrategy();
        const foldLines = vscode_extension_common_1.Lines.findAllLinesContainingCurrentWordOrSelection();
        fold.foldLines(foldLines);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('dakara-foldplus.selection.exclude', () => {
        warnFoldStrategy();
        const excludedLines = vscode_extension_common_1.Lines.findAllLinesContainingCurrentWordOrSelection();
        fold.foldAllExcept(excludedLines);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('dakara-foldplus.cursor.exclude', () => {
        warnFoldStrategy();
        const textEditor = vscode.window.activeTextEditor;
        const selection = textEditor.selection;
        fold.foldAllExcept([selection.anchor.line]);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('dakara-foldplus.toggle.indentation', () => __awaiter(this, void 0, void 0, function* () {
        const newValue = yield vscode_extension_common_1.Application.settingsCycleNext('editor', 'foldingStrategy', ['auto', 'indentation']);
        vscode.window.showInformationMessage('Set Folding Strategy: ' + newValue);
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function warnFoldStrategy() {
    const currentFoldingStrategy = vscode.workspace.getConfiguration('editor').get('foldingStrategy');
    if (currentFoldingStrategy === 'auto')
        vscode.window.showWarningMessage("Fold Plus features require 'indentation' folding.  Use command `Fold Plus: Toggle Indentation/Language Folding` to set 'indentation' folding when using Fold Plus");
}
//# sourceMappingURL=extension.js.map