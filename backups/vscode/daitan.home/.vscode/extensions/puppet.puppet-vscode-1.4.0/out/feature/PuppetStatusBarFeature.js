/* eslint-disable @typescript-eslint/no-use-before-define */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppetStatusBarFeature = void 0;
const vscode = require("vscode");
const interfaces_1 = require("../interfaces");
const messages_1 = require("../messages");
const settings_1 = require("../settings");
class PuppetStatusBarProvider {
    constructor(langIDs, config, logger) {
        this.logger = logger;
        this.config = config;
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1);
        this.statusBarItem.command = messages_1.PuppetCommandStrings.PuppetShowConnectionMenuCommandId;
        this.statusBarItem.show();
        vscode.window.onDidChangeActiveTextEditor((textEditor) => {
            if (textEditor === undefined || langIDs.indexOf(textEditor.document.languageId) === -1) {
                this.statusBarItem.hide();
            }
            else {
                this.statusBarItem.show();
            }
        });
    }
    setConnectionStatus(statusText, status, toolTip) {
        this.logger.debug(`Setting status bar to ${statusText}`);
        // Icons are from https://octicons.github.com/
        let statusIconText;
        let statusColor;
        switch (status) {
            case interfaces_1.ConnectionStatus.RunningLoaded:
                statusIconText = '$(terminal) ';
                statusColor = '#affc74';
                break;
            case interfaces_1.ConnectionStatus.RunningLoading:
                // When the editor service is starting, it's functional but it may be missing
                // type/class/function/fact info.  But language only features like format document
                // or document symbol, are available
                statusIconText = '$(sync~spin) ';
                statusColor = '#affc74';
                break;
            case interfaces_1.ConnectionStatus.Failed:
                statusIconText = '$(alert) ';
                statusColor = '#fcc174';
                break;
            default:
                // ConnectionStatus.NotStarted
                // ConnectionStatus.Starting
                // ConnectionStatus.Stopping
                statusIconText = '$(gear) ';
                statusColor = '#f3fc74';
                break;
        }
        statusIconText = (statusIconText + statusText).trim();
        this.statusBarItem.color = statusColor;
        // Using a conditional here because resetting a $(sync~spin) will cause the animation to restart. Instead
        // Only change the status bar text if it has actually changed.
        if (this.statusBarItem.text !== statusIconText) {
            this.statusBarItem.text = statusIconText;
        }
        this.statusBarItem.tooltip = toolTip; // TODO: killme (new Date()).getUTCDate().toString() + "\nNewline\nWee!";
    }
    showConnectionMenu() {
        const menuItems = [];
        menuItems.push(new PuppetConnectionMenuItem('Show Puppet Session Logs', () => {
            vscode.commands.executeCommand(messages_1.PuppetCommandStrings.PuppetShowConnectionLogsCommandId);
        }));
        if (this.config.ruby.pdkPuppetVersions !== undefined &&
            this.config.ruby.pdkPuppetVersions.length > 0 &&
            this.config.connection.protocol != settings_1.ProtocolType.TCP) {
            // Add a static menu item to use the latest version
            menuItems.push(new PuppetConnectionMenuItem('Switch to latest Puppet version', () => {
                vscode.commands.executeCommand(messages_1.PuppetCommandStrings.PuppetUpdateConfigurationCommandId, {
                    'puppet.editorService.puppet.version': undefined,
                });
            }));
            this.config.ruby.pdkPuppetVersions
                .sort((a, b) => b.localeCompare(a, undefined, { numeric: true })) // Reverse sort
                .forEach((puppetVersion) => {
                menuItems.push(new PuppetConnectionMenuItem('Switch to Puppet ' + puppetVersion.toString(), () => {
                    vscode.commands.executeCommand(messages_1.PuppetCommandStrings.PuppetUpdateConfigurationCommandId, {
                        'puppet.editorService.puppet.version': puppetVersion,
                    });
                }));
            });
        }
        vscode.window.showQuickPick(menuItems).then((selectedItem) => {
            if (selectedItem) {
                selectedItem.callback();
            }
        });
    }
}
class PuppetConnectionMenuItem {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(label, callback = () => { }) {
        this.label = label;
        this.callback = callback;
        this.description = '';
    }
}
class PuppetStatusBarFeature {
    constructor(langIDs, config, logger, context) {
        context.subscriptions.push(vscode.commands.registerCommand(messages_1.PuppetCommandStrings.PuppetShowConnectionMenuCommandId, () => {
            this.provider.showConnectionMenu();
        }));
        this.provider = new PuppetStatusBarProvider(langIDs, config, logger);
    }
    setConnectionStatus(statusText, status, toolTip) {
        this.provider.setConnectionStatus(statusText, status, toolTip);
    }
    dispose() {
        return undefined;
    }
}
exports.PuppetStatusBarFeature = PuppetStatusBarFeature;
//# sourceMappingURL=PuppetStatusBarFeature.js.map