/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.defaultClient = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
const shell = require("shelljs");
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const os = require("os");
const commands_1 = require("./constants/commands");
const runTestFromCodeLens_1 = require("./commands/runTestFromCodeLens");
const clients = new Map();
let _sortedWorkspaceFolders;
function testElixirCommand(command) {
    try {
        return child_process_1.execSync(`${command} -e " "`);
    }
    catch {
        return false;
    }
}
function testElixir() {
    let testResult = testElixirCommand("elixir");
    if (testResult === false) {
        // Try finding elixir in the path directly
        const elixirPath = shell.which("elixir");
        if (elixirPath) {
            testResult = testElixirCommand(elixirPath);
        }
    }
    if (!testResult) {
        vscode.window.showErrorMessage("Failed to run 'elixir' command. ElixirLS will probably fail to launch. Logged PATH to Development Console.");
        console.warn(`Failed to run 'elixir' command. Current process's PATH: ${process.env["PATH"]}`);
        return false;
    }
    else if (testResult.length > 0) {
        vscode.window.showErrorMessage("Running 'elixir' command caused extraneous print to stdout. See VS Code's developer console for details.");
        console.warn("Running 'elixir -e \"\"' printed to stdout:\n" + testResult.toString());
        return false;
    }
    else {
        return true;
    }
}
function detectConflictingExtension(extensionId) {
    const extension = vscode.extensions.getExtension(extensionId);
    if (extension) {
        vscode.window.showErrorMessage("Warning: " +
            extensionId +
            " is not compatible with ElixirLS, please uninstall " +
            extensionId);
    }
}
function sortedWorkspaceFolders() {
    if (_sortedWorkspaceFolders === void 0) {
        _sortedWorkspaceFolders = vscode_1.workspace.workspaceFolders
            ? vscode_1.workspace.workspaceFolders
                .map((folder) => {
                let result = folder.uri.toString();
                if (result.charAt(result.length - 1) !== "/") {
                    result = result + "/";
                }
                return result;
            })
                .sort((a, b) => {
                return a.length - b.length;
            })
            : [];
    }
    return _sortedWorkspaceFolders;
}
vscode_1.workspace.onDidChangeWorkspaceFolders(() => (_sortedWorkspaceFolders = undefined));
function getOuterMostWorkspaceFolder(folder) {
    const sorted = sortedWorkspaceFolders();
    for (const element of sorted) {
        let uri = folder.uri.toString();
        if (uri.charAt(uri.length - 1) !== "/") {
            uri = uri + "/";
        }
        if (uri.startsWith(element)) {
            return vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.parse(element));
        }
    }
    return folder;
}
function configureCopyDebugInfo(context) {
    const disposable = vscode.commands.registerCommand("extension.copyDebugInfo", () => {
        const elixirVersion = child_process_1.execSync(`elixir --version`);
        const extension = vscode.extensions.getExtension("jakebecker.elixir-ls");
        if (!extension) {
            return;
        }
        const message = `
* Elixir & Erlang versions (elixir --version): ${elixirVersion}
* VSCode ElixirLS version: ${extension.packageJSON.version}
* Operating System Version: ${os.platform()} ${os.release()}
`;
        vscode.window.showInformationMessage(`Copied to clipboard: ${message}`);
        vscode.env.clipboard.writeText(message);
    });
    context.subscriptions.push(disposable);
}
class DebugAdapterExecutableFactory {
    createDebugAdapterDescriptor(session, executable) {
        if (session.workspaceFolder) {
            const cwd = session.workspaceFolder.uri.fsPath;
            let options;
            if (executable.options) {
                options = { ...executable.options, cwd };
            }
            else {
                options = { cwd };
            }
            return new vscode.DebugAdapterExecutable(executable.command, executable.args, options);
        }
        return executable;
    }
}
function configureDebugger(context) {
    // Use custom DebugAdaptureExecutableFactory that launches the debugger with
    // the current working directory set to the workspace root so asdf can load
    // the correct environment properly.
    const factory = new DebugAdapterExecutableFactory();
    const disposable = vscode.debug.registerDebugAdapterDescriptorFactory("mix_task", factory);
    context.subscriptions.push(disposable);
}
function configureTerminalLinkProvider(context) {
    function openUri(uri, line) {
        vscode.workspace.openTextDocument(uri).then(document => {
            vscode.window.showTextDocument(document).then(editor => {
                const position = new vscode.Position(line - 1, 0);
                const selection = new vscode.Selection(position, position);
                editor.revealRange(selection);
                editor.selection = selection;
            });
        });
    }
    const disposable = vscode.window.registerTerminalLinkProvider({
        provideTerminalLinks: (context, token) => {
            const regex = /(?:\((?<app>[_a-z]+) \d+.\d+.\d+\) )(?<file>[_a-z\/]*[_a-z]+.ex):(?<line>\d+)/;
            const matches = context.line.match(regex);
            if (matches === null) {
                return [];
            }
            return [
                {
                    startIndex: matches.index,
                    length: matches[0].length,
                    data: {
                        app: matches.groups.app,
                        file: matches.groups.file,
                        line: parseInt(matches.groups.line),
                    },
                },
            ];
        },
        handleTerminalLink: ({ data: { app, file, line } }) => {
            let umbrellaFile = path.join("apps", app, file);
            vscode.workspace.findFiles(`{${umbrellaFile},${file}}`).then(uris => {
                if (uris.length === 1) {
                    openUri(uris[0], line);
                }
                else if (uris.length > 1) {
                    const items = uris.map(uri => ({ label: uri.toString(), uri }));
                    vscode.window.showQuickPick(items).then(selection => {
                        if (!selection) {
                            return;
                        }
                        openUri(selection.uri, line);
                    });
                }
            });
        }
    });
    context.subscriptions.push(disposable);
}
function configureRunTestFromCodeLens() {
    vscode.commands.registerCommand(commands_1.default.RUN_TEST_FROM_CODELENS, runTestFromCodeLens_1.default);
}
function activate(context) {
    testElixir();
    detectConflictingExtension("mjmcloug.vscode-elixir");
    // https://github.com/elixir-lsp/vscode-elixir-ls/issues/34
    detectConflictingExtension("sammkj.vscode-elixir-formatter");
    configureRunTestFromCodeLens();
    configureCopyDebugInfo(context);
    configureDebugger(context);
    configureTerminalLinkProvider(context);
    const command = os.platform() == "win32" ? "language_server.bat" : "language_server.sh";
    const serverOpts = {
        command: context.asAbsolutePath("./elixir-ls-release/" + command),
    };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: serverOpts,
        debug: serverOpts,
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for Elixir documents
        documentSelector: [
            { language: "elixir", scheme: "file" },
            { language: "elixir", scheme: "untitled" },
            { language: "eex", scheme: "file" },
            { language: "eex", scheme: "untitled" },
            { language: "html-eex", scheme: "file" },
            { language: "html-eex", scheme: "untitled" },
        ],
        // Don't focus the Output pane on errors because request handler errors are no big deal
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
        synchronize: {
            // Synchronize the setting section 'elixirLS' to the server
            configurationSection: "elixirLS",
            // Notify the server about file changes to Elixir files contained in the workspace
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher("**/*.{ex,exs,erl,yrl,xrl,eex,leex}"),
            ],
        },
    };
    function didOpenTextDocument(document) {
        // We are only interested in elixir files
        if (document.languageId !== "elixir") {
            return;
        }
        const uri = document.uri;
        // Untitled files go to a default client.
        if (uri.scheme === "untitled" && !exports.defaultClient) {
            // Create the language client and start the client.
            exports.defaultClient = new vscode_languageclient_1.LanguageClient("elixirLS", // langId
            "ElixirLS", // display name
            serverOptions, clientOptions);
            const disposable = exports.defaultClient.start();
            // Push the disposable to the context's subscriptions so that the
            // client can be deactivated on extension deactivation
            context.subscriptions.push(disposable);
            return;
        }
        let folder = vscode_1.workspace.getWorkspaceFolder(uri);
        // Files outside a folder can't be handled. This might depend on the language.
        // Single file languages like JSON might handle files outside the workspace folders.
        if (!folder) {
            return;
        }
        // If we have nested workspace folders we only start a server on the outer most workspace folder.
        folder = getOuterMostWorkspaceFolder(folder);
        if (!clients.has(folder.uri.toString())) {
            const workspaceClientOptions = Object.assign({}, clientOptions, {
                documentSelector: [
                    {
                        language: "elixir",
                        scheme: "file",
                        pattern: `${folder.uri.fsPath}/**/*`,
                    },
                    {
                        language: "elixir",
                        scheme: "untitled",
                        pattern: `${folder.uri.fsPath}/**/*`,
                    },
                ],
                workspaceFolder: folder,
            });
            const client = new vscode_languageclient_1.LanguageClient("elixirLS", // langId
            "ElixirLS", // display name
            serverOptions, workspaceClientOptions);
            const disposable = client.start();
            context.subscriptions.push(disposable);
            clients.set(folder.uri.toString(), client);
        }
    }
    vscode_1.workspace.onDidOpenTextDocument(didOpenTextDocument);
    vscode_1.workspace.textDocuments.forEach(didOpenTextDocument);
    vscode_1.workspace.onDidChangeWorkspaceFolders((event) => {
        for (const folder of event.removed) {
            const client = clients.get(folder.uri.toString());
            if (client) {
                clients.delete(folder.uri.toString());
                client.stop();
            }
        }
    });
}
exports.activate = activate;
function deactivate() {
    const promises = [];
    if (exports.defaultClient) {
        promises.push(exports.defaultClient.stop());
    }
    for (const client of clients.values()) {
        promises.push(client.stop());
    }
    return Promise.all(promises).then(() => undefined);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map