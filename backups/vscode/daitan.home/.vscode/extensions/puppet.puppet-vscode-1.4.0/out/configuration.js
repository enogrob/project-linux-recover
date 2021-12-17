'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateConfiguration = exports.CreateAggregrateConfiguration = void 0;
const fs = require("fs");
const path = require("path");
const pathResolver_1 = require("./configuration/pathResolver");
const pdk = require("./configuration/pdkResolver");
const settings_1 = require("./settings");
/** Creates an Aggregate Configuration based on the VSCode Workspace settings (ISettings) */
function CreateAggregrateConfiguration(settings) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const value = new AggregateConfiguration(settings);
    return value;
}
exports.CreateAggregrateConfiguration = CreateAggregrateConfiguration;
class AggregateConfiguration {
    constructor(settings) {
        this.workspace = settings;
        // If the user has set the installType to 'auto' then we need
        // to resolve which install type we will actually use
        if (settings.installType === settings_1.PuppetInstallType.AUTO) {
            if (fs.existsSync(this.getPdkBasePath())) {
                settings.installType = settings_1.PuppetInstallType.PDK;
            }
            else if (fs.existsSync(this.getAgentBasePath())) {
                settings.installType = settings_1.PuppetInstallType.PUPPET;
            }
            else {
                // We can't automatically figure it out so, assume PDK
                // TODO: Should we log this?
                settings.installType = settings_1.PuppetInstallType.PDK;
            }
        }
        const puppetBaseDir = this.calculatePuppetBaseDir(settings);
        const puppetDir = this.safeJoin(puppetBaseDir, 'puppet');
        const facterDir = this.safeJoin(puppetBaseDir, 'facter');
        const rubyDir = this.calculateRubyDir(puppetBaseDir);
        let pdkInstance = pdk.emptyPDKInstance();
        let puppetVersions = [];
        if (settings.installType === settings_1.PuppetInstallType.PDK) {
            const pdkInfo = pdk.pdkInstances(puppetBaseDir);
            let result;
            if (settings.editorService !== undefined &&
                settings.editorService.puppet !== undefined &&
                settings.editorService.puppet.version !== undefined) {
                result = pdkInfo.InstanceForPuppetVersion(settings.editorService.puppet.version);
            }
            // If we can't find the PDK instance from the puppet version or it wasn't defined, assume the latest.
            if (result === undefined) {
                result = pdkInfo.latest;
            }
            // An undefined instance means that either PDK isn't installed or that
            // the requested version doesn't exist.
            if (result !== undefined) {
                pdkInstance = result;
            }
            puppetVersions = pdkInfo.allPuppetVersions;
        }
        this.ruby = {
            puppetBaseDir: puppetBaseDir,
            puppetDir: puppetDir,
            languageServerPath: this.safeJoin('vendor', 'languageserver', 'puppet-languageserver'),
            debugServerPath: this.safeJoin('vendor', 'languageserver', 'puppet-debugserver'),
            rubydir: rubyDir,
            rubylib: this.calculateRubylib(puppetDir, facterDir),
            environmentPath: this.calculateEnvironmentPath(puppetDir, facterDir, puppetBaseDir, rubyDir),
            sslCertFile: this.safeJoin(puppetDir, 'ssl', 'cert.pem'),
            sslCertDir: this.safeJoin(puppetDir, 'ssl', 'certs'),
            pdkBinDir: this.safeJoin(puppetBaseDir, 'bin'),
            pdkRubyLib: this.replaceSlashes(this.safeJoin(puppetBaseDir, 'lib')),
            pdkRubyVerDir: pdkInstance.rubyVerDir,
            pdkGemDir: pdkInstance.gemDir,
            pdkRubyDir: pdkInstance.rubyDir,
            pdkRubyBinDir: pdkInstance.rubyBinDir,
            pdkGemVerDir: pdkInstance.gemVerDir,
            pdkPuppetVersions: puppetVersions,
            pdkVersion: this.getPdkVersionFromFile(puppetBaseDir),
        };
        this.connection = {
            type: this.calculateConnectionType(settings),
            protocol: settings.editorService !== undefined && settings.editorService.protocol === settings_1.ProtocolType.TCP
                ? settings_1.ProtocolType.TCP
                : settings_1.ProtocolType.STDIO,
        };
    }
    safeJoin(...paths) {
        let foundUndefined = false;
        // path.join makes sure that no elements are 'undefined' and throws if there is. Instead
        // we can search for it and just return undefined ourself.
        paths.forEach((item) => {
            foundUndefined = foundUndefined || item === undefined;
        });
        if (foundUndefined) {
            return undefined;
        }
        return path.join(...paths);
    }
    calculateConnectionType(settings) {
        if (settings.editorService === undefined) {
            return undefined;
        }
        switch (settings.editorService.protocol) {
            case settings_1.ProtocolType.TCP:
                if (settings.editorService.tcp.address === '127.0.0.1' ||
                    settings.editorService.tcp.address === 'localhost' ||
                    settings.editorService.tcp.address === '') {
                    return settings_1.ConnectionType.Local;
                }
                else {
                    return settings_1.ConnectionType.Remote;
                }
            case settings_1.ProtocolType.STDIO:
                // STDIO can only ever be local
                return settings_1.ConnectionType.Local;
            default:
                // In this case we have no idea what the type is
                return undefined;
        }
    }
    // PATH=%PUPPET_DIR%\bin;%FACTERDIR%\bin;%HIERA_DIR%\bin;%PL_BASEDIR%\bin;%RUBY_DIR%\bin;%PL_BASEDIR%\sys\tools\bin;%PATH%
    calculateEnvironmentPath(puppetDir, facterDir, puppetBaseDir, rubydir) {
        return [
            path.join(puppetDir, 'bin'),
            path.join(facterDir, 'bin'),
            // path.join(hieraDir, 'bin'),
            path.join(puppetBaseDir, 'bin'),
            path.join(rubydir, 'bin'),
            path.join(puppetBaseDir, 'sys', 'tools', 'bin'),
        ].join(pathResolver_1.PathResolver.pathEnvSeparator());
    }
    // RUBYLIB=%PUPPET_DIR%\lib;%FACTERDIR%\lib;%HIERA_DIR%\lib;%RUBYLIB%
    calculateRubylib(puppetDir, facterDir) {
        return this.replaceSlashes([
            path.join(puppetDir, 'lib'),
            path.join(facterDir, 'lib'),
        ].join(pathResolver_1.PathResolver.pathEnvSeparator()));
    }
    calculateRubyDir(puppetBaseDir) {
        switch (process.platform) {
            case 'win32':
                return path.join(puppetBaseDir, 'sys', 'ruby');
            default:
                return path.join(puppetBaseDir, 'lib', 'ruby');
        }
    }
    calculatePuppetBaseDir(settings) {
        if (settings.installDirectory !== null &&
            settings.installDirectory !== undefined &&
            settings.installDirectory.trim() !== '') {
            return settings.installDirectory;
        }
        switch (settings.installType) {
            case settings_1.PuppetInstallType.PDK:
                return this.getPdkBasePath();
            case settings_1.PuppetInstallType.PUPPET:
                return this.getAgentBasePath();
            default:
                return this.getPdkBasePath();
        }
    }
    getAgentBasePath() {
        const programFiles = pathResolver_1.PathResolver.getprogramFiles();
        switch (process.platform) {
            case 'win32':
                // On Windows we have a subfolder called 'Puppet' that has
                // every product underneath
                return path.join(programFiles, 'Puppet Labs', 'Puppet');
            default:
                // On *nix we don't have a sub folder called 'Puppet'
                return path.join(programFiles, 'puppetlabs');
        }
    }
    getPdkBasePath() {
        const programFiles = pathResolver_1.PathResolver.getprogramFiles();
        switch (process.platform) {
            case 'win32':
                return path.join(programFiles, 'Puppet Labs', 'DevelopmentKit');
            default:
                return path.join(programFiles, 'puppetlabs', 'pdk');
        }
    }
    getPdkVersionFromFile(puppetBaseDir) {
        const basePath = path.join(puppetBaseDir, 'PDK_VERSION');
        if (fs.existsSync(basePath)) {
            const contents = fs.readFileSync(basePath, 'utf8').toString();
            return contents.trim();
        }
        else {
            return '';
        }
    }
    findFirstDirectory(rootDir) {
        if (!fs.existsSync(rootDir)) {
            return undefined;
        }
        const files = fs.readdirSync(rootDir);
        const result = files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).reverse()[0];
        return path.join(rootDir, result);
    }
    replaceSlashes(path) {
        if (path === undefined) {
            return path;
        }
        if (process.platform === 'win32') {
            // Translate all slashes to / style to avoid puppet/ruby issue #11930
            path = path.replace(/\\/g, '/');
        }
        return path;
    }
}
exports.AggregateConfiguration = AggregateConfiguration;
//# sourceMappingURL=configuration.js.map