"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyPDKInstance = exports.pdkInstances = void 0;
const fs = require("fs");
const path = require("path");
// PDK Directory Layout
// *nix -    /opt/puppetlabs/pdk/
// Windows - C:\Program Files\Puppet Labs\DevelopmentKit
// | private
// |   | puppet
// |   |   | ruby
// |   |       | 2.5.0               <---- pdkRubyVerDir (GEM_PATH #3) (contains puppet gems e.g. puppet, ffi, gettext)
// |   | ruby
// |       | 2.5.1                   <---- pdkRubyDir
// |           | bin                 <---- pdkRubyBinDir
// |           | lib
// |               | ruby
// |                   | gems
// |                       | 2.5.0   <---- pdkGemVerDir (GEM_PATH #1) (contains base gem set e.g. bundler, rubygems)
// | share
//     | cache
//         | ruby
//             | 2.5.0               <---- pdkGemDir (GEM_PATH #2, replaceSlashes) (contains all the ancillary gems e.g. puppet-lint, rspec)
function pdkInstances(pdkRootDirectory) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new PDKRubyInstances(pdkRootDirectory);
}
exports.pdkInstances = pdkInstances;
function emptyPDKInstance() {
    return {
        rubyVerDir: undefined,
        rubyDir: undefined,
        rubyBinDir: undefined,
        gemVerDir: undefined,
        gemDir: undefined,
        puppetVersions: undefined,
        rubyVersion: undefined,
        valid: false,
    };
}
exports.emptyPDKInstance = emptyPDKInstance;
class PDKRubyInstances {
    constructor(pdkRootDirectory) {
        this.rubyInstances = undefined;
        this.puppetVersions = undefined;
        this.pdkDirectory = pdkRootDirectory;
    }
    get instances() {
        if (this.rubyInstances !== undefined) {
            return this.rubyInstances;
        }
        this.rubyInstances = new Array();
        if (this.pdkDirectory === undefined) {
            return this.rubyInstances;
        }
        if (!fs.existsSync(this.pdkDirectory)) {
            return this.rubyInstances;
        }
        const rubyDir = path.join(this.pdkDirectory, 'private', 'ruby');
        if (!fs.existsSync(rubyDir)) {
            return this.rubyInstances;
        }
        fs.readdirSync(rubyDir).forEach((item) => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            this.rubyInstances.push(new PDKRubyInstance(this.pdkDirectory, path.join(rubyDir, item)));
        });
        return this.rubyInstances;
    }
    get allPuppetVersions() {
        if (this.puppetVersions !== undefined) {
            return this.puppetVersions;
        }
        this.puppetVersions = [];
        // This searching method isn't the most performant but as the list will probably
        // be very small (< 20 items) it's not a big deal and is cached anyway
        this.instances.forEach((instance) => {
            instance.puppetVersions.forEach((puppetVersion) => {
                if (this.puppetVersions.indexOf(puppetVersion) === -1) {
                    this.puppetVersions.push(puppetVersion);
                }
            });
        });
        return this.puppetVersions;
    }
    InstanceForPuppetVersion(puppetVersion) {
        return this.instances.find((instance) => {
            return instance.puppetVersions.includes(puppetVersion);
        });
    }
    // Override toString to make it look pretty
    toString() {
        return ('[' +
            this.instances
                .map((item) => {
                return item.toString();
            })
                .join(', ') +
            ']');
    }
    get latest() {
        let result = undefined;
        let lastVersion = '0.0.0';
        this.instances.forEach((instance) => {
            // We don't have a real semver module so treat the strings as numbers and sort.
            if (instance.rubyVersion.localeCompare(lastVersion, undefined, { numeric: true }) > 0) {
                result = instance;
                lastVersion = instance.rubyVersion;
            }
        });
        return result;
    }
}
class PDKRubyInstance {
    constructor(pdkDirectory, rubyDir) {
        this._valid = undefined;
        this._rubyDir = rubyDir;
        this._rubyBinDir = path.join(rubyDir, 'bin');
        this._rubyVersion = path.basename(rubyDir);
        // This is a little naive however there doesn't appear to be a native semver module
        // loaded in VS Code. The gem path is always the <Major>.<Minor>.0 version of the
        // corresponding Ruby version
        const gemDirName = this._rubyVersion.replace(/\.\d+$/, '.0');
        // Calculate gem paths
        this._rubyVerDir = path.join(pdkDirectory, 'private', 'puppet', 'ruby', gemDirName);
        this._gemVerDir = path.join(this._rubyDir, 'lib', 'ruby', 'gems', gemDirName);
        this._gemDir = path.join(pdkDirectory, 'share', 'cache', 'ruby', gemDirName);
    }
    // Directory Paths
    get rubyVerDir() {
        return this._rubyVerDir;
    }
    get rubyDir() {
        return this._rubyDir;
    }
    get rubyBinDir() {
        return this._rubyBinDir;
    }
    get gemVerDir() {
        return this._gemVerDir;
    }
    get gemDir() {
        return this._gemDir;
    }
    get rubyVersion() {
        return this._rubyVersion;
    }
    get valid() {
        if (this._valid !== undefined) {
            return this._valid;
        }
        // This instance is valid if these directories exist
        this._valid =
            fs.existsSync(this._rubyDir) &&
                fs.existsSync(this._rubyBinDir) &&
                fs.existsSync(this._rubyVerDir) &&
                fs.existsSync(this._gemVerDir) &&
                fs.existsSync(this._gemDir);
        return this._valid;
    }
    get puppetVersions() {
        if (this._puppetVersions !== undefined) {
            return this._puppetVersions;
        }
        this._puppetVersions = [];
        const gemdir = path.join(this._rubyVerDir, 'gems');
        if (!fs.existsSync(gemdir)) {
            return this._puppetVersions;
        }
        // We could just call Ruby and ask it for all gems called puppet, but searching
        // the gem cache is just as easy and doesn't need to spawn a ruby process per
        // ruby version.
        fs.readdirSync(gemdir).forEach((item) => {
            const pathMatch = item.match(/^puppet-(\d+\.\d+\.\d+)(?:(-|$))/);
            if (pathMatch !== null) {
                this._puppetVersions.push(pathMatch[1]);
            }
        });
        return this._puppetVersions;
    }
    // Override toString to make it look pretty
    toString() {
        return ('{' +
            [
                `rubyVersion: "${this._rubyVersion}"`,
                `rubyDir: "${this._rubyDir}"`,
                `rubyVerDir: "${this.rubyVerDir}"`,
                `gemVerDir: "${this.gemVerDir}"`,
                `gemDir: "${this.gemDir}"`,
                `gemDir: "${this.gemDir}"`,
                `puppetVersions: "${this.puppetVersions}"`,
                `valid: "${this.valid}"`,
            ].join(', ') +
            '}');
    }
}
//# sourceMappingURL=pdkResolver.js.map