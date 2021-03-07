"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErlangDebugAdapterExecutableFactory = exports.InlineErlangDebugAdapterFactory = exports.ErlangDebugAdapterDescriptorFactory = void 0;
const vscode_1 = require("vscode");
const net_1 = require("net");
const erlangDebugSession_1 = require("./erlangDebugSession");
class ErlangDebugAdapterDescriptorFactory {
    createDebugAdapterDescriptor(session, executable) {
        if (!this.server) {
            // start listening on a random port
            this.server = net_1.createServer(socket => {
                const session = new erlangDebugSession_1.ErlangDebugSession(true);
                session.setRunAsServer(true);
                session.start(socket, socket);
            }).listen(0);
        }
        // make VS Code connect to debug server
        return new vscode_1.DebugAdapterServer(this.server.address().port);
    }
    dispose() {
        if (this.server) {
            this.server.close();
        }
    }
}
exports.ErlangDebugAdapterDescriptorFactory = ErlangDebugAdapterDescriptorFactory;
class InlineErlangDebugAdapterFactory {
    createDebugAdapterDescriptor(session, executable) {
        return new vscode_1.DebugAdapterInlineImplementation(new erlangDebugSession_1.ErlangDebugSession(true));
    }
}
exports.InlineErlangDebugAdapterFactory = InlineErlangDebugAdapterFactory;
class ErlangDebugAdapterExecutableFactory {
    constructor(extenstionPath) {
        this.extenstionPath = extenstionPath;
    }
    createDebugAdapterDescriptor(session, executable) {
        // param "executable" contains the executable optionally specified in the package.json (if any)
        // use the executable specified in the package.json if it exists or determine it based on some other information (e.g. the session)
        if (!executable) {
            const command = "node";
            const args = [
                "./out/lib/erlangDebug.js",
            ];
            const options = {
                cwd: this.extenstionPath,
            };
            executable = new vscode_1.DebugAdapterExecutable(command, args, options);
        }
        // make VS Code launch the DA executable
        return executable;
    }
}
exports.ErlangDebugAdapterExecutableFactory = ErlangDebugAdapterExecutableFactory;
//# sourceMappingURL=ErlangAdapterDescriptorFactory.js.map