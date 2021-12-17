/* eslint-disable @typescript-eslint/no-use-before-define */
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
exports.deactivate = exports.activate = exports.puppetFileLangID = exports.puppetLangID = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const configuration_1 = require("./configuration");
const DebuggingFeature_1 = require("./feature/DebuggingFeature");
const FormatDocumentFeature_1 = require("./feature/FormatDocumentFeature");
const PDKFeature_1 = require("./feature/PDKFeature");
const PuppetfileCompletionFeature_1 = require("./feature/PuppetfileCompletionFeature");
const PuppetfileHoverFeature_1 = require("./feature/PuppetfileHoverFeature");
const PuppetModuleHoverFeature_1 = require("./feature/PuppetModuleHoverFeature");
const PuppetNodeGraphFeature_1 = require("./feature/PuppetNodeGraphFeature");
const PuppetResourceFeature_1 = require("./feature/PuppetResourceFeature");
const PuppetStatusBarFeature_1 = require("./feature/PuppetStatusBarFeature");
const UpdateConfigurationFeature_1 = require("./feature/UpdateConfigurationFeature");
const forge_1 = require("./forge");
const stdio_1 = require("./handlers/stdio");
const tcp_1 = require("./handlers/tcp");
const outputchannel_1 = require("./logging/outputchannel");
const settings_1 = require("./settings");
const telemetry_1 = require("./telemetry");
const facts_1 = require("./views/facts");
const puppetfile_1 = require("./views/puppetfile");
exports.puppetLangID = 'puppet'; // don't change this
exports.puppetFileLangID = 'puppetfile'; // don't change this
const debugType = 'Puppet'; // don't change this
let extContext;
let connectionHandler;
let logger;
let configSettings;
let extensionFeatures = [];
function activate(context) {
    const pkg = vscode.extensions.getExtension('jpogran.puppet-vscode');
    if (pkg) {
        const message = 'The "jpogran.puppet-vscode" extension has been detected, which will conflict with the "puppet.puppet-vscode" extension. This will cause problems activating when each extension tries to load at the same time and may cause errors. Please uninstall it by executing the following from the commandline: "code --uninstall-extension jpogran.puppet-vscode"';
        vscode.window.showWarningMessage(message, { modal: false });
    }
    extContext = context;
    setLanguageConfiguration();
    notifyOnNewExtensionVersion(extContext);
    checkForLegacySettings();
    const settings = settings_1.SettingsFromWorkspace();
    const previousInstallType = settings.installType;
    configSettings = configuration_1.CreateAggregrateConfiguration(settings);
    logger = new outputchannel_1.OutputChannelLogger(configSettings.workspace.editorService.loglevel);
    if (configSettings.workspace.installType !== previousInstallType) {
        logger.debug(`Installation type has changed from ${previousInstallType} to ${configSettings.workspace.installType}`);
    }
    telemetry_1.reporter.sendTelemetryEvent('config', {
        installType: configSettings.workspace.installType,
        protocol: configSettings.workspace.editorService.protocol,
        pdkVersion: configSettings.ruby.pdkVersion,
    });
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        const currentWorkspaceFolder = workspaceFolders[0];
        const puppetfile = path.join(currentWorkspaceFolder.uri.fsPath, 'Puppetfile');
        const exists = fs.existsSync(puppetfile);
        if (exists && configSettings.workspace.editorService.enable) {
            vscode.commands.executeCommand('setContext', 'puppet:puppetfileEnabled', true);
        }
    }
    const statusBar = new PuppetStatusBarFeature_1.PuppetStatusBarFeature([exports.puppetLangID, exports.puppetFileLangID], configSettings, logger, context);
    extensionFeatures = [
        new PDKFeature_1.PDKFeature(extContext, logger),
        new UpdateConfigurationFeature_1.UpdateConfigurationFeature(logger, extContext),
        statusBar,
        new PuppetfileHoverFeature_1.PuppetfileHoverFeature(extContext, logger),
        new PuppetfileCompletionFeature_1.PuppetfileCompletionFeature(extContext, logger),
    ];
    if (configSettings.workspace.editorService.enable === false) {
        notifyEditorServiceDisabled(extContext);
        telemetry_1.reporter.sendTelemetryEvent('editorServiceDisabled');
        return;
    }
    if (checkInstallDirectory(configSettings, logger) === false) {
        // If this returns false, then we needed a local directory
        // but did not find it, so we should abort here
        // If we return true, we can continue
        // This can be revisited to enable disabling language server portion
        return;
    }
    // this happens after checkInstallDirectory so that we don't check pdk version
    // if it's not installed
    if (settings.pdk.checkVersion) {
        notifyIfNewPDKVersion(extContext, configSettings);
    }
    // eslint-disable-next-line default-case
    switch (configSettings.workspace.editorService.protocol) {
        case settings_1.ProtocolType.STDIO:
            connectionHandler = new stdio_1.StdioConnectionHandler(extContext, statusBar, logger, configSettings);
            break;
        case settings_1.ProtocolType.TCP:
            connectionHandler = new tcp_1.TcpConnectionHandler(extContext, statusBar, logger, configSettings);
            break;
    }
    extensionFeatures.push(new FormatDocumentFeature_1.FormatDocumentFeature(exports.puppetLangID, connectionHandler, configSettings, logger, extContext));
    extensionFeatures.push(new PuppetNodeGraphFeature_1.PuppetNodeGraphFeature(exports.puppetLangID, connectionHandler, logger, extContext));
    extensionFeatures.push(new PuppetResourceFeature_1.PuppetResourceFeature(extContext, connectionHandler, logger));
    extensionFeatures.push(new DebuggingFeature_1.DebuggingFeature(debugType, configSettings, extContext, logger));
    if (settings.hover.showMetadataInfo) {
        extensionFeatures.push(new PuppetModuleHoverFeature_1.PuppetModuleHoverFeature(extContext, logger));
    }
    const facts = new facts_1.PuppetFactsProvider(connectionHandler);
    vscode.window.registerTreeDataProvider('puppetFacts', facts);
    const puppetfileView = new puppetfile_1.PuppetfileProvider(connectionHandler);
    vscode.window.registerTreeDataProvider('puppetfile', puppetfileView);
}
exports.activate = activate;
function deactivate() {
    // Dispose all extension features
    extensionFeatures.forEach((feature) => {
        feature.dispose();
    });
    if (connectionHandler !== undefined) {
        connectionHandler.stop();
    }
    telemetry_1.reporter.dispose();
}
exports.deactivate = deactivate;
function checkForLegacySettings() {
    // Raise a warning if we detect any legacy settings
    const legacySettingValues = settings_1.legacySettings();
    if (legacySettingValues.size > 0) {
        const settingNames = [];
        for (const [settingName, _value] of legacySettingValues) {
            settingNames.push(settingName);
        }
        vscode.window.showWarningMessage('Deprecated Puppet settings have been detected. Please either remove them or, convert them to the correct settings names. (' +
            settingNames.join(', ') +
            ')', { modal: false });
    }
}
function checkInstallDirectory(config, logger) {
    if (config.workspace.editorService.protocol === settings_1.ProtocolType.TCP) {
        if (config.connection.type === settings_1.ConnectionType.Remote) {
            // Return if we are connecting to a remote TCP LangServer
            return true;
        }
    }
    // we want to check directory if STDIO or Local TCP
    if (!fs.existsSync(config.ruby.puppetBaseDir)) {
        let message = '';
        // Need to use SettingsFromWorkspace() here because the AggregateConfiguration
        // changes the installType from Auto, to its calculated value
        if (settings_1.SettingsFromWorkspace().installType === settings_1.PuppetInstallType.AUTO) {
            const m = [
                'The extension failed to find a Puppet installation automatically in the default locations for PDK and for Puppet Agent.',
                'While syntax highlighting and grammar detection will still work, intellisense and other advanced features will not.',
            ];
            message = m.join(' ');
        }
        else {
            message = `Could not find a valid Puppet installation at '${config.ruby.puppetBaseDir}'. While syntax highlighting and grammar detection will still work, intellisense and other advanced features will not.`;
        }
        showErrorMessage(message, 'Troubleshooting Information', 'https://puppet-vscode.github.io/docs/experience-a-problem', logger);
        return false;
    }
    else {
        logger.debug('Found a valid Puppet installation at ' + config.ruby.puppetDir);
        return true;
    }
}
function showErrorMessage(message, title, helpLink, logger) {
    logger.error(message);
    vscode.window.showErrorMessage(message, { modal: false }, { title: title }).then((item) => {
        if (item === undefined) {
            return;
        }
        if (item.title === title) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(helpLink));
        }
    });
}
function notifyOnNewExtensionVersion(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const puppetExtension = vscode.extensions.getExtension('puppet.puppet-vscode');
        const version = puppetExtension.packageJSON.version;
        const viewReleaseNotes = 'View Release Notes';
        const suppressUpdateNotice = 'SuppressUpdateNotice';
        const dontShowAgainNotice = "Don't show again";
        if (context.globalState.get(suppressUpdateNotice, false)) {
            return;
        }
        const result = yield vscode.window.showInformationMessage(`Puppet VSCode has been updated to v${version}`, { modal: false }, { title: dontShowAgainNotice }, { title: viewReleaseNotes });
        if (result === undefined) {
            return;
        }
        if (result.title === viewReleaseNotes) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://marketplace.visualstudio.com/items/puppet.puppet-vscode/changelog'));
        }
        else {
            context.globalState.update(suppressUpdateNotice, true);
        }
    });
}
function notifyEditorServiceDisabled(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const suppressEditorServicesDisabled = 'suppressEditorServicesDisabled';
        const dontShowAgainNotice = "Don't show again";
        if (context.globalState.get(suppressEditorServicesDisabled, false)) {
            return;
        }
        const result = yield vscode.window.showInformationMessage(`Puppet Editor Services has been disabled. While syntax highlighting and grammar detection will still work, intellisense and other advanced features will not.`, { modal: false }, { title: dontShowAgainNotice });
        if (result === undefined) {
            return;
        }
        if (result.title === dontShowAgainNotice) {
            context.globalState.update(suppressEditorServicesDisabled, true);
        }
    });
}
function notifyIfNewPDKVersion(context, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        const suppressPDKUpdateCheck = 'suppressPDKUpdateCheck';
        const dontCheckAgainNotice = "Don't check again";
        const viewPDKDownloadPage = 'More info';
        if (context.globalState.get(suppressPDKUpdateCheck, false)) {
            return;
        }
        let version = '';
        if (settings.ruby.pdkVersion) {
            version = settings.ruby.pdkVersion;
        }
        else {
            // should we throw a warning here? technically this is only reached *if* a
            // PDK install is found, so the only way this is null is if the PDK_VERSION
            // file was removed.
            return;
        }
        forge_1.getPDKVersion(logger)
            .then((latestVersion) => {
            if (version !== latestVersion) {
                return vscode.window.showWarningMessage(`The installed PDK version is ${version}, the newest version is ${latestVersion}. To find out how to update to the latest version click the more info button`, { modal: false }, { title: dontCheckAgainNotice }, { title: viewPDKDownloadPage });
            }
        })
            .then((result) => {
            if (result === undefined) {
                return;
            }
            if (result.title === dontCheckAgainNotice) {
                context.globalState.update(suppressPDKUpdateCheck, true);
            }
            if (result.title === viewPDKDownloadPage) {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://puppet.com/download-puppet-development-kit'));
            }
        })
            .catch((error) => {
            logger.error(error);
        });
    });
}
function setLanguageConfiguration() {
    vscode.languages.setLanguageConfiguration(exports.puppetLangID, {
        onEnterRules: [
            {
                // foo{'bar':}
                beforeText: /^.*{\s{0,}'.*':/,
                afterText: /\s{0,}}$/,
                action: {
                    indentAction: vscode.IndentAction.IndentOutdent,
                },
            },
        ],
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        comments: {
            lineComment: '#',
            blockComment: ['/*', '*/'],
        },
    });
    vscode.languages.setLanguageConfiguration(exports.puppetFileLangID, {
        onEnterRules: [],
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        comments: {
            lineComment: '#',
            blockComment: ['/*', '*/'],
        },
    });
}
//# sourceMappingURL=extension.js.map