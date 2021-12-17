"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandEnvironmentHelper = void 0;
const path = require("path");
const vscode = require("vscode");
const pathResolver_1 = require("../configuration/pathResolver");
const settings_1 = require("../settings");
class CommandEnvironmentHelper {
    static getLanguageServerRubyEnvFromConfiguration(languageServerpath, config) {
        const exe = {
            command: this.buildExecutableCommand(config),
            args: this.buildLanguageServerArguments(languageServerpath, config),
            options: {},
        };
        this.applyRubyEnvFromConfiguration(exe, config);
        return exe;
    }
    static getDebugServerRubyEnvFromConfiguration(debugServerpath, config) {
        const exe = {
            command: this.buildExecutableCommand(config),
            args: this.buildDebugServerArguments(debugServerpath),
            options: {},
        };
        this.applyRubyEnvFromConfiguration(exe, config);
        return exe;
    }
    static applyRubyEnvFromConfiguration(exe, config) {
        // setup defaults
        exe.options.env = this.shallowCloneObject(process.env);
        exe.options.stdio = 'pipe';
        switch (process.platform) {
            case 'win32':
                break;
            default:
                exe.options.shell = true;
                break;
        }
        this.cleanEnvironmentPath(exe);
        // eslint-disable-next-line default-case
        switch (config.workspace.installType) {
            case settings_1.PuppetInstallType.PDK:
                CommandEnvironmentHelper.buildPDKEnvironment(exe, config);
                break;
            case settings_1.PuppetInstallType.PUPPET:
                CommandEnvironmentHelper.buildPuppetEnvironment(exe, config);
                break;
        }
        // undefined or null values still appear in the child spawn environment variables
        // In this case these elements should be removed from the Object
        this.removeEmptyElements(exe.options.env);
        return exe;
    }
    static shallowCloneObject(value) {
        const clone = {};
        for (const propertyName in value) {
            // eslint-disable-next-line no-prototype-builtins
            if (value.hasOwnProperty(propertyName)) {
                clone[propertyName] = value[propertyName];
            }
        }
        return clone;
    }
    static removeEmptyElements(obj) {
        const propNames = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < propNames.length; i++) {
            const propName = propNames[i];
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
    }
    static cleanEnvironmentPath(exe) {
        if (exe.options.env.PATH === undefined) {
            // It's possible that there is no PATH set but unlikely. Due to Object property names being
            // case sensitive it could simply be that it's called Path or path, particularly on Windows
            // not so much on Linux etc.. Look through all of the environment names looking for PATH in a
            // case insensitive way and remove the conflicting env var.
            let envPath = '';
            Object.keys(exe.options.env).forEach(function (keyname) {
                if (keyname.match(/^PATH$/i)) {
                    envPath = exe.options.env[keyname];
                    exe.options.env[keyname] = undefined;
                }
            });
            exe.options.env.PATH = envPath;
        }
        if (exe.options.env.RUBYLIB === undefined) {
            exe.options.env.RUBYLIB = '';
        }
    }
    static buildExecutableCommand(config) {
        let command = '';
        // eslint-disable-next-line default-case
        switch (config.workspace.installType) {
            case settings_1.PuppetInstallType.PDK:
                command = path.join(config.ruby.pdkRubyDir, 'bin', 'ruby');
                break;
            case settings_1.PuppetInstallType.PUPPET:
                command = 'ruby';
                break;
        }
        return command;
    }
    static buildLanguageServerArguments(serverPath, settings) {
        const args = [serverPath];
        switch (settings.workspace.editorService.protocol) {
            case settings_1.ProtocolType.STDIO:
                args.push('--stdio');
                break;
            case settings_1.ProtocolType.TCP:
                if (settings.workspace.editorService.tcp.address === undefined ||
                    settings.workspace.editorService.tcp.address === '') {
                    args.push('--ip=127.0.0.1');
                }
                else {
                    args.push('--ip=' + settings.workspace.editorService.tcp.address);
                }
                if (settings.workspace.editorService.tcp.port !== 0) {
                    args.push('--port=' + settings.workspace.editorService.tcp.port);
                }
                break;
            default:
                break;
        }
        args.push('--timeout=' + settings.workspace.editorService.timeout);
        if (vscode.workspace.workspaceFolders !== undefined) {
            const path = `--local-workspace='${vscode.workspace.workspaceFolders[0].uri.fsPath}'`;
            args.push(path);
        }
        // Convert the individual puppet settings into the --puppet-settings
        // command line argument
        const puppetSettings = [];
        [
            { name: 'confdir', value: settings.workspace.editorService.puppet.confdir },
            { name: 'environment', value: settings.workspace.editorService.puppet.environment },
            { name: 'modulepath', value: settings.workspace.editorService.puppet.modulePath },
            { name: 'vardir', value: settings.workspace.editorService.puppet.vardir },
        ].forEach(function (item) {
            if (item.value !== undefined && item.value !== '') {
                puppetSettings.push('--' + item.name + ',' + item.value);
            }
        });
        if (puppetSettings.length > 0) {
            args.push('--puppet-settings=' + puppetSettings.join(','));
        }
        if (settings.workspace.editorService.puppet.version !== undefined &&
            settings.workspace.editorService.puppet.version.trim() !== '') {
            args.push('--puppet-version=' + settings.workspace.editorService.puppet.version.trim());
        }
        if (settings.workspace.editorService.debugFilePath !== undefined &&
            settings.workspace.editorService.debugFilePath !== '') {
            args.push('--debug=' + settings.workspace.editorService.debugFilePath);
        }
        return args;
    }
    static buildDebugServerArguments(serverPath) {
        const args = [serverPath];
        // The Debug Adapter always runs on TCP and IPv4 loopback
        // Using localhost can have issues due to ruby and node differing on what address
        // to use for localhost e.g Ruby may prefer 127.0.0.1 (IP4) and Node may prefer ::1 (IP6)
        // and therefore won't connect.
        args.push('--ip=127.0.0.1');
        // TODO: Add additional command line args e.g. --debuglogfie
        return args;
    }
    static buildPuppetEnvironment(exe, config) {
        exe.options.env.RUBYOPT = 'rubygems';
        exe.options.env.SSL_CERT_FILE = config.ruby.sslCertFile;
        exe.options.env.SSL_CERT_DIR = config.ruby.sslCertDir;
        exe.options.env.RUBY_DIR = config.ruby.rubydir;
        exe.options.env.PATH = this.buildPathArray([config.ruby.environmentPath, exe.options.env.PATH]);
        exe.options.env.RUBYLIB = this.buildPathArray([config.ruby.rubylib, exe.options.env.RUBYLIB]);
    }
    static buildPDKEnvironment(exe, config) {
        exe.options.env.RUBYOPT = 'rubygems';
        exe.options.env.DEVKIT_BASEDIR = config.ruby.puppetBaseDir;
        exe.options.env.RUBY_DIR = config.ruby.pdkRubyDir;
        exe.options.env.GEM_HOME = config.ruby.pdkGemDir;
        exe.options.env.GEM_PATH = this.buildPathArray([
            config.ruby.pdkGemVerDir,
            config.ruby.pdkGemDir,
            config.ruby.pdkRubyVerDir,
        ]);
        exe.options.env.RUBYLIB = this.buildPathArray([config.ruby.pdkRubyLib, exe.options.env.RUBYLIB]);
        exe.options.env.PATH = this.buildPathArray([
            config.ruby.pdkBinDir,
            config.ruby.pdkRubyBinDir,
            // temporary fix for ffi 1.14.2
            // remove when pdk 2.X comes out https://github.com/puppetlabs/puppet-vscode/issues/730
            path.join(config.ruby.puppetBaseDir, 'private', 'git', 'mingw64', 'bin'),
            path.join(config.ruby.puppetBaseDir, 'private', 'git', 'mingw64', 'libexec', 'git-core'),
            path.join(config.ruby.puppetBaseDir, 'private', 'git', 'usr', 'bin'),
            exe.options.env.PATH,
        ]);
    }
    static buildPathArray(items) {
        return items.join(pathResolver_1.PathResolver.pathEnvSeparator());
    }
}
exports.CommandEnvironmentHelper = CommandEnvironmentHelper;
//# sourceMappingURL=commandHelper.js.map