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
exports.UpdateConfigurationFeature = void 0;
const vscode = require("vscode");
const messages_1 = require("../messages");
class UpdateConfigurationFeature {
    constructor(logger, context) {
        this.settingsRequireRestart = ['puppet.editorService.puppet.version'];
        this.logger = logger;
        context.subscriptions.push(vscode.commands.registerCommand(messages_1.PuppetCommandStrings.PuppetUpdateConfigurationCommandId, (updateSettingsHash) => {
            this.updateSettingsAsync(updateSettingsHash);
        }));
    }
    updateSettingsAsync(updateSettingsHash) {
        return __awaiter(this, void 0, void 0, function* () {
            // If there are no workspace folders then we've just opened a puppet file.  Therefore we can't updated the workspace folder settings, so we need to update
            // the global configuration instead.
            const configTarget = vscode.workspace.workspaceFolders === undefined || vscode.workspace.workspaceFolders.length === 0
                ? vscode.ConfigurationTarget.Global
                : null;
            let requiresRestart = false;
            yield Object.keys(updateSettingsHash).forEach((key) => {
                requiresRestart = requiresRestart || this.settingsRequireRestart.includes(key);
                const value = updateSettingsHash[key];
                const config = vscode.workspace.getConfiguration();
                this.logger.debug('Updating configuration item ' + key + " to '" + value + "'");
                config.update(key, value, configTarget);
            });
            if (requiresRestart) {
                vscode.window
                    .showInformationMessage('Puppet extensions needs to restart the editor. Would you like to do that now?', { modal: false }, ...['Yes', 'No'])
                    .then((selection) => {
                    if (selection === 'Yes') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            }
        });
    }
    dispose() {
        return undefined;
    }
}
exports.UpdateConfigurationFeature = UpdateConfigurationFeature;
//# sourceMappingURL=UpdateConfigurationFeature.js.map