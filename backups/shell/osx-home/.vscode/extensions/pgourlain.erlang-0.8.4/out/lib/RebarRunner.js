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
exports.RebarRunner = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const RebarShell_1 = require("./RebarShell");
const utils = require("./utils");
const vscodeAdapter_1 = require("./vscodeAdapter");
const ErlangConfigurationProvider_1 = require("./ErlangConfigurationProvider");
var rebarOutputChannel;
/*
Rebar Compile
see : https://github.com/hoovercj/vscode-extension-tutorial

*/
class RebarRunner {
    activate(context) {
        const subscriptions = context.subscriptions;
        this.extensionPath = context.extensionPath;
        this.compileCommand = vscode.commands.registerCommand('extension.rebarBuild', () => { this.runRebarCompile(); });
        this.getDepsCommand = vscode.commands.registerCommand('extension.rebarGetDeps', () => { this.runRebarCommand(['get-deps']); });
        this.updateDepsCommand = vscode.commands.registerCommand('extension.rebarUpdateDeps', () => { this.runRebarCommand(['update-deps']); });
        this.eunitCommand = vscode.commands.registerCommand('extension.rebareunit', () => { this.runRebarCommand(['eunit']); });
        this.dialyzerCommand = vscode.commands.registerCommand('extension.dialyzer', () => { this.runDialyzer(); });
        vscode.workspace.onDidCloseTextDocument(this.onCloseDocument.bind(this), null, subscriptions);
        vscode.workspace.onDidOpenTextDocument(this.onOpenDocument.bind(this), null, subscriptions);
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection("erlang");
        subscriptions.push(this);
    }
    dispose() {
        this.diagnosticCollection.dispose();
        this.compileCommand.dispose();
        this.getDepsCommand.dispose();
        this.updateDepsCommand.dispose();
        this.eunitCommand.dispose();
        this.dialyzerCommand.dispose();
    }
    runRebarCompile() {
        try {
            const buildArgs = ErlangConfigurationProvider_1.getElangConfigConfiguration().rebarBuildArgs;
            this.runScript(buildArgs).then(data => {
                this.diagnosticCollection.clear();
                this.parseCompilationResults(data);
            });
        }
        catch (e) {
            vscode.window.showErrorMessage('Couldn\'t execute rebar.\n' + e);
        }
    }
    parseForDiag(data, diagnostics, regex, severity) {
        //parse data while regex return matches
        do {
            var m = regex.exec(data);
            if (m) {
                var fileName = m[1];
                var peace = data.substring(m.index, regex.lastIndex);
                data = data.replace(peace, "");
                let message = m[m.length - 1];
                let range = new vscode.Range(Number(m[2]) - 1, 0, Number(m[2]) - 1, peace.length - 1);
                let diagnostic = new vscode.Diagnostic(range, message, severity);
                regex.lastIndex = 0;
                if (!diagnostics[fileName]) {
                    diagnostics[fileName] = [];
                }
                diagnostics[fileName].push(diagnostic);
            }
        } while (m != null);
        return data;
    }
    parseCompilationResults(data) {
        //how to test regexp : https://regex101.com/#javascript
        var diagnostics = {};
        //parsing warning at first
        var warnings = new RegExp("^(.*):(\\d+):(.*)Warning:(.*)$", "gmi");
        data = this.parseForDiag(data, diagnostics, warnings, vscode.DiagnosticSeverity.Warning);
        //then parse errors (because regex to detect errors include warnings too)
        var errors = new RegExp("^(.*):(\\d+):(.*)$", "gmi");
        data = this.parseForDiag(data, diagnostics, errors, vscode.DiagnosticSeverity.Error);
        var keys = utils.keysFromDictionary(diagnostics);
        keys.forEach(element => {
            var fileUri = vscode.Uri.file(path.join(vscode.workspace.rootPath, element));
            var diags = diagnostics[element];
            this.diagnosticCollection.set(fileUri, diags);
        });
    }
    runRebarCommand(command) {
        try {
            this.runScript(command).then(data => {
            }, reject => { });
        }
        catch (e) {
            vscode.window.showErrorMessage('Couldn\'t execute rebar.\n' + e);
        }
    }
    runDialyzer() {
        try {
            this.runScript(["dialyzer"]).then(data => {
                this.diagnosticCollection.clear();
                var lines = data.split("\n");
                var currentFile = null;
                var lineAndMessage = new RegExp("^ +([0-9]+): *(.+)$");
                var diagnostics = {};
                for (var i = 0; i < lines.length; ++i) {
                    if (lines[i]) {
                        var match = lineAndMessage.exec(lines[i]);
                        if (match && currentFile) {
                            if (!diagnostics[currentFile])
                                diagnostics[currentFile] = [];
                            var range = new vscode.Range(Number(match[1]) - 1, 0, Number(match[1]) - 1, 255);
                            diagnostics[currentFile].push(new vscode.Diagnostic(range, match[2], vscode.DiagnosticSeverity.Information));
                        }
                        else {
                            var filepath = path.join(vscode.workspace.rootPath, lines[i]);
                            if (fs.existsSync(filepath))
                                currentFile = filepath;
                        }
                    }
                    else
                        currentFile = null;
                }
                utils.keysFromDictionary(diagnostics).forEach(filepath => {
                    var fileUri = vscode.Uri.file(filepath);
                    var diags = diagnostics[filepath];
                    this.diagnosticCollection.set(fileUri, diags);
                });
                if (utils.keysFromDictionary(diagnostics).length > 0)
                    vscode.commands.executeCommand("workbench.action.problems.focus");
            }, reject => { });
        }
        catch (e) {
            vscode.window.showErrorMessage('Couldn\'t execute rebar.\n' + e);
        }
    }
    /**
     * Get search paths for the rebar executable in order of priority.
     *
     * @returns Directories to search for the rebar executable
     */
    getRebarSearchPaths() {
        const cfgRebarPath = ErlangConfigurationProvider_1.getElangConfigConfiguration().rebarPath, rebarSearchPaths = [];
        if (cfgRebarPath) {
            rebarSearchPaths.push(cfgRebarPath);
        }
        if (cfgRebarPath !== vscode.workspace.rootPath) {
            rebarSearchPaths.push(vscode.workspace.rootPath);
        }
        return rebarSearchPaths;
    }
    /**
     * Execute rebar on the workspace project with supplied arguments.
     *
     * @param commands - Arguments to rebar
     * @returns Promise resolved or rejected when rebar exits
     */
    runScript(commands) {
        return __awaiter(this, void 0, void 0, function* () {
            const { output } = yield new RebarShell_1.default(this.getRebarSearchPaths(), this.extensionPath, vscodeAdapter_1.ErlangOutputAdapter(RebarRunner.RebarOutput))
                .runScript(vscode.workspace.rootPath, commands);
            return output;
        });
    }
    onCloseDocument(doc) {
        //RebarRunner.RebarOutput.appendLine("doc close : " + doc.uri.toString());
        if (this.diagnosticCollection) {
            this.diagnosticCollection.delete(doc.uri);
        }
    }
    onOpenDocument(doc) {
        //RebarRunner.RebarOutput.appendLine("doc open : " + doc.uri.toString());
    }
    static get RebarOutput() {
        if (!rebarOutputChannel) {
            rebarOutputChannel = vscode.window.createOutputChannel('rebar');
        }
        return rebarOutputChannel;
    }
}
exports.RebarRunner = RebarRunner;
RebarRunner.commandId = 'extension.rebarBuild';
//# sourceMappingURL=RebarRunner.js.map