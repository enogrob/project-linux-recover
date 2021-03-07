"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const Adapter = require("./vscodeAdapter");
const Rebar = require("./RebarRunner");
const Eunit = require("./eunitRunner");
const ErlangConfigurationProvider_1 = require("./ErlangConfigurationProvider");
const ErlangAdapterDescriptorFactory_1 = require("./ErlangAdapterDescriptorFactory");
const erlangConnection = require("./erlangConnection");
const LspClient = require("./lsp/lspclientextension");
var myoutputChannel;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    erlangConnection.setExtensionPath(context.extensionPath);
    myoutputChannel = Adapter.ErlangOutput();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "erlang" is now active!');
    myoutputChannel.appendLine("erlang extension is active");
    //configuration of erlang language -> documentation : https://code.visualstudio.com/Docs/extensionAPI/vscode-api#LanguageConfiguration
    var disposables = [];
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    //disposables.push(vscode.commands.registerCommand('extension.rebarBuild', () => { runRebarCommand(['compile']);}));
    var rebar = new Rebar.RebarRunner();
    rebar.activate(context);
    var eunit = new Eunit.EunitRunner();
    eunit.activate(context);
    disposables.push(vscode_1.debug.registerDebugConfigurationProvider("erlang", new ErlangConfigurationProvider_1.ErlangDebugConfigurationProvider()));
    disposables.push(vscode_1.workspace.onDidChangeConfiguration((e) => ErlangConfigurationProvider_1.configurationChanged()));
    let runMode = ErlangConfigurationProvider_1.getElangConfigConfiguration().debuggerRunMode;
    let factory;
    switch (runMode) {
        case 'server':
            // run the debug adapter as a server inside the extension and communicating via a socket
            factory = new ErlangAdapterDescriptorFactory_1.ErlangDebugAdapterDescriptorFactory();
            break;
        case 'inline':
            // run the debug adapter inside the extension and directly talk to it
            factory = new ErlangAdapterDescriptorFactory_1.InlineErlangDebugAdapterFactory();
            break;
        case 'external':
        default:
            // run the debug adapter as a separate process
            factory = new ErlangAdapterDescriptorFactory_1.ErlangDebugAdapterExecutableFactory(context.extensionPath);
            break;
    }
    disposables.push(vscode_1.debug.registerDebugAdapterDescriptorFactory('erlang', factory));
    if ('dispose' in factory) {
        disposables.push(factory);
    }
    disposables.forEach((disposable => context.subscriptions.push(disposable)));
    LspClient.activate(context);
    vscode_1.languages.setLanguageConfiguration("erlang", {
        onEnterRules: [
            // Module comment: always continue comment
            {
                beforeText: /^%%% .*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "%%% " }
            },
            {
                beforeText: /^%%%.*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "%%%" }
            },
            // Comment line with double %: continue comment if needed
            {
                beforeText: /^\s*%% .*$/,
                afterText: /^.*\S.*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "%% " }
            },
            {
                beforeText: /^\s*%%.*$/,
                afterText: /^.*\S.*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "%%" }
            },
            // Comment line with single %: continue comment if needed
            {
                beforeText: /^\s*% .*$/,
                afterText: /^.*\S.*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "% " }
            },
            {
                beforeText: /^\s*%.*$/,
                afterText: /^.*\S.*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "%" }
            },
            // Any other comment line: do nothing, ignore below rules
            {
                beforeText: /^\s*%.*$/,
                afterText: /^\s*$/,
                action: { indentAction: vscode_1.IndentAction.None }
            },
            // Empty line: do nothing, ignore below rules
            {
                beforeText: /^\s*$/,
                action: { indentAction: vscode_1.IndentAction.None }
            },
            // Before guard sequence (before 'when')
            {
                beforeText: /.*/,
                afterText: /^\s*when(\s.*)?$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "  " }
            },
            // After guard sequence (after 'when')
            {
                beforeText: /^\s*when(\s.*)?->\s*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "  " }
            },
            {
                beforeText: /^\s*when(\s.*)?(,|;)\s*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: "     " }
            },
            // Start of clause, right hand side of an assignment, after 'after', etc.
            {
                beforeText: /^.*(->|[^=]=|\s+(after|case|catch|if|of|receive|try))\s*$/,
                action: { indentAction: vscode_1.IndentAction.Indent }
            },
            // Not closed bracket
            {
                beforeText: /^.*[(][^)]*$/,
                action: { indentAction: vscode_1.IndentAction.Indent }
            },
            {
                beforeText: /^.*[{][^}]*$/,
                action: { indentAction: vscode_1.IndentAction.Indent }
            },
            {
                beforeText: /^.*[[][^\]]*$/,
                action: { indentAction: vscode_1.IndentAction.Indent }
            },
            // One liner clause but not the last
            {
                beforeText: /^.*->.+;\s*$/,
                action: { indentAction: vscode_1.IndentAction.None }
            },
            // End of function or attribute (e.g. export list)
            {
                beforeText: /^.*\.\s*$/,
                action: { indentAction: vscode_1.IndentAction.Outdent, removeText: 9000 }
            },
            // End of clause but not the last
            // FIXME: After a guard (;) it falsely outdents
            {
                beforeText: /^.*;\s*$/,
                action: { indentAction: vscode_1.IndentAction.Outdent }
            },
            // Last statement of a clause
            // TODO: double outdent or outdent + removeText: <tabsize>
            {
                beforeText: /^.*[^;,[({<]\s*$/,
                action: { indentAction: vscode_1.IndentAction.Outdent }
            }
        ]
    });
}
exports.activate = activate;
function deactivate() {
    return LspClient.deactivate();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map