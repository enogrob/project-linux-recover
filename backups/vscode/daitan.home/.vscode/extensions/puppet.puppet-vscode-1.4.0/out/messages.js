"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDKCommandStrings = exports.PuppetCommandStrings = exports.CompileNodeGraphRequest = exports.PuppetNodeGraphRequest = exports.PuppetFixDiagnosticErrorsRequest = exports.PuppetResourceRequest = exports.PuppetVersionRequest = void 0;
/* eslint-disable @typescript-eslint/no-namespace */
const vscode_languageclient_1 = require("vscode-languageclient");
var PuppetVersionRequest;
(function (PuppetVersionRequest) {
    PuppetVersionRequest.type = new vscode_languageclient_1.RequestType0('puppet/getVersion');
})(PuppetVersionRequest = exports.PuppetVersionRequest || (exports.PuppetVersionRequest = {}));
var PuppetResourceRequest;
(function (PuppetResourceRequest) {
    PuppetResourceRequest.type = new vscode_languageclient_1.RequestType('puppet/getResource');
})(PuppetResourceRequest = exports.PuppetResourceRequest || (exports.PuppetResourceRequest = {}));
var PuppetFixDiagnosticErrorsRequest;
(function (PuppetFixDiagnosticErrorsRequest) {
    PuppetFixDiagnosticErrorsRequest.type = new vscode_languageclient_1.RequestType('puppet/fixDiagnosticErrors');
})(PuppetFixDiagnosticErrorsRequest = exports.PuppetFixDiagnosticErrorsRequest || (exports.PuppetFixDiagnosticErrorsRequest = {}));
var PuppetNodeGraphRequest;
(function (PuppetNodeGraphRequest) {
    PuppetNodeGraphRequest.type = new vscode_languageclient_1.RequestType('puppet/compileNodeGraph');
})(PuppetNodeGraphRequest = exports.PuppetNodeGraphRequest || (exports.PuppetNodeGraphRequest = {}));
var CompileNodeGraphRequest;
(function (CompileNodeGraphRequest) {
    CompileNodeGraphRequest.type = new vscode_languageclient_1.RequestType('puppet/compileNodeGraph');
})(CompileNodeGraphRequest = exports.CompileNodeGraphRequest || (exports.CompileNodeGraphRequest = {}));
let PuppetCommandStrings = /** @class */ (() => {
    class PuppetCommandStrings {
    }
    PuppetCommandStrings.PuppetResourceCommandId = 'extension.puppetResource';
    PuppetCommandStrings.PuppetShowConnectionMenuCommandId = 'extension.puppetShowConnectionMenu';
    PuppetCommandStrings.PuppetShowConnectionLogsCommandId = 'extension.puppetShowConnectionLogs';
    PuppetCommandStrings.PuppetUpdateConfigurationCommandId = 'extension.puppetUpdateConfiguration';
    return PuppetCommandStrings;
})();
exports.PuppetCommandStrings = PuppetCommandStrings;
let PDKCommandStrings = /** @class */ (() => {
    class PDKCommandStrings {
    }
    PDKCommandStrings.PdkNewModuleCommandId = 'extension.pdkNewModule';
    PDKCommandStrings.PdkNewClassCommandId = 'extension.pdkNewClass';
    PDKCommandStrings.PdkNewTaskCommandId = 'extension.pdkNewTask';
    PDKCommandStrings.PdkNewFactCommandId = 'extension.pdkNewFact';
    PDKCommandStrings.PdkNewFunctionCommandId = 'extension.pdkNewFunction';
    PDKCommandStrings.PdkNewDefinedTypeCommandId = 'extension.pdkNewDefinedType';
    PDKCommandStrings.PdkValidateCommandId = 'extension.pdkValidate';
    PDKCommandStrings.PdkTestUnitCommandId = 'extension.pdkTestUnit';
    return PDKCommandStrings;
})();
exports.PDKCommandStrings = PDKCommandStrings;
//# sourceMappingURL=messages.js.map