"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElangConfigConfiguration = exports.configurationChanged = exports.ErlangDebugConfigurationProvider = void 0;
const vscode_1 = require("vscode");
class ErlangDebugConfigurationProvider {
    provideDebugConfigurations(folder, token) {
        if (folder) {
            return [];
        }
        return undefined;
    }
    resolveDebugConfiguration(folder, debugConfiguration, token) {
        let cfg = getElangConfigConfiguration();
        debugConfiguration.verbose = cfg.verbose;
        debugConfiguration.erlangPath = cfg.erlangPath;
        return debugConfiguration;
    }
}
exports.ErlangDebugConfigurationProvider = ErlangDebugConfigurationProvider;
;
let currentSettings = null;
function configurationChanged() {
    let erlangConf = vscode_1.workspace.getConfiguration("erlang");
    let settings = {
        erlangPath: erlangConf.get("erlangPath", null),
        rebarPath: erlangConf.get("rebarPath", null),
        codeLensEnabled: erlangConf.get('codeLensEnabled', false),
        debuggerRunMode: erlangConf.get("debuggerRunMode", "Server"),
        includePaths: erlangConf.get("includePaths", []),
        linting: erlangConf.get('linting', false),
        rebarBuildArgs: erlangConf.get("rebarBuildArgs", ['compile']),
        rootPath: vscode_1.workspace.rootPath,
        verbose: erlangConf.get("verbose", false)
    };
    currentSettings = settings;
}
exports.configurationChanged = configurationChanged;
function getElangConfigConfiguration() {
    if (!currentSettings) {
        configurationChanged();
    }
    return currentSettings;
}
exports.getElangConfigConfiguration = getElangConfigConfiguration;
//# sourceMappingURL=ErlangConfigurationProvider.js.map