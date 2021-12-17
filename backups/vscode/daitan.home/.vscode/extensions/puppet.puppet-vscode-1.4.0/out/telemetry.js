"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reporter = void 0;
/* eslint-disable @typescript-eslint/no-use-before-define */
const vscode = require("vscode");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
exports.reporter = getTelemetryReporter();
function getTelemetryReporter() {
    const pkg = getPackageInfo();
    const reporter = new vscode_extension_telemetry_1.default(pkg.name, pkg.version, pkg.aiKey);
    return reporter;
}
function getPackageInfo() {
    const pkg = vscode.extensions.getExtension('puppet.puppet-vscode');
    return {
        name: pkg.packageJSON.name,
        version: pkg.packageJSON.version,
        aiKey: pkg.packageJSON.aiKey,
    };
}
//# sourceMappingURL=telemetry.js.map