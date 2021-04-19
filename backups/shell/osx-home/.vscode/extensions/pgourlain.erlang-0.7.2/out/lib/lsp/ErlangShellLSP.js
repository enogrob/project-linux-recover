"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErlangShellLSP = void 0;
const GenericShell_1 = require("../GenericShell");
const ErlangConfigurationProvider_1 = require("../ErlangConfigurationProvider");
class ErlangShellLSP extends GenericShell_1.GenericShell {
    constructor(whichOutput) {
        super(whichOutput, null, ErlangConfigurationProvider_1.getElangConfigConfiguration());
    }
    Start(erlPath, startDir, listen_port, bridgePath, args) {
        //var debugStartArgs = ["-pa", `"${bridgePath}"`, "-pa", "ebin", "-s", "int",
        var debugStartArgs = ["-noshell", "-pa", "src", "-pa", "ebin", "-s", "int",
            "-vscode_port", listen_port.toString(),
            "-s", "vscode_lsp_entry", "start", listen_port.toString()];
        var processArgs = debugStartArgs.concat([args]);
        var result = this.LaunchProcess("erl", startDir, processArgs);
        return result;
    }
}
exports.ErlangShellLSP = ErlangShellLSP;
//# sourceMappingURL=ErlangShellLSP.js.map