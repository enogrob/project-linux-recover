"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErlangShellForDebugging = exports.FunctionBreakpoint = void 0;
const GenericShell_1 = require("./GenericShell");
const path = require("path");
const os = require("os");
const fs = require("fs");
//inspired from https://github.com/WebFreak001/code-debug/blob/master/src/backend/mi2/mi2.ts for inspiration of an EventEmitter 
const nonOutput = /^(?:\d*|undefined)[\*\+\=]|[\~\@\&\^]/;
class FunctionBreakpoint {
    constructor(i, n, mn, fn, a) {
        this.id = i;
        this.verified = false;
        this.name = n;
        this.moduleName = mn;
        this.functionName = fn;
        this.arity = a;
    }
}
exports.FunctionBreakpoint = FunctionBreakpoint;
// export interface IErlangShellOutputForDebugging {
//     show(): void;
//     appendLine(value: string): void;
//     append(value: string): void;
//     debug(value: string): void;
//     error(value: string): void;
// }
class ErlangShellForDebugging extends GenericShell_1.GenericShell {
    constructor(whichOutput) {
        super(whichOutput);
        this.breakPoints = [];
        this.functionBreakPoints = [];
    }
    Start(erlPath, startDir, listen_port, bridgePath, launchArguments) {
        var randomSuffix = Math.floor(Math.random() * 10000000).toString();
        this.argsFileName = path.join(os.tmpdir(), path.basename(startDir) + '_' + randomSuffix);
        this.argsPrecompiledFileName = path.join(os.tmpdir(), 'bp_' + randomSuffix + ".erl");
        this.argsPrecompiledFileName = this.formatPath(this.argsPrecompiledFileName);
        var debugStartArgs = ["-noshell", "-pa", `"${bridgePath}"`, "-s", "int",
            "-vscode_port", listen_port.toString()];
        if (!launchArguments.noDebug) {
            debugStartArgs.push("-compiled_args_file", `"${this.argsPrecompiledFileName}"`);
        }
        debugStartArgs.push("-s", "vscode_connection", "start");
        var argsFile = this.createArgsFilev1(startDir, launchArguments.noDebug, launchArguments.addEbinsToCodepath, launchArguments.verbose);
        var processArgs = debugStartArgs.concat(argsFile).concat([launchArguments.arguments]);
        this.started = true;
        var result = this.LaunchProcess(erlPath, startDir, processArgs, !launchArguments.verbose);
        return result;
    }
    CleanupAfterStart() {
        if (this.argsFileName && fs.existsSync(this.argsFileName)) {
            fs.unlinkSync(this.argsFileName);
        }
        if (this.argsPrecompiledFileName && fs.existsSync(this.argsPrecompiledFileName)) {
            fs.unlinkSync(this.argsPrecompiledFileName);
            var beamFile = path.join(path.dirname(this.argsPrecompiledFileName), path.basename(this.argsPrecompiledFileName, ".erl")) + ".beam";
            if (fs.existsSync(beamFile)) {
                fs.unlinkSync(beamFile);
            }
        }
    }
    uniqueBy(arr, keySelector) {
        var unique = {};
        var distinct = [];
        arr.forEach(function (x) {
            var key = keySelector(x);
            if (!unique[key]) {
                distinct.push(x);
                unique[key] = true;
            }
        });
        return distinct;
    }
    formatPath(filePath) {
        if (os.platform() == 'win32') {
            if (filePath == undefined) {
                return filePath;
            }
            filePath = filePath.split("\\").join("/");
            return filePath;
        }
        return filePath;
    }
    findEbinDirs(dir, dirList = []) {
        fs.readdirSync(dir).forEach(name => {
            const fullpath = path.join(dir, name);
            if (fs.existsSync(fullpath) && fs.statSync(fullpath).isDirectory()) {
                if (name === 'ebin')
                    dirList.push(fullpath);
                else
                    this.findEbinDirs(fullpath, dirList);
            }
        });
        return dirList;
    }
    findErlFiles(dir, fileList = []) {
        fs.readdirSync(dir).forEach(file => {
            if (file == '_build')
                return;
            const filePath = path.join(dir, file);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())
                this.findErlFiles(filePath, fileList);
            else if (path.extname(file) === '.erl')
                fileList.push(filePath);
        });
        return fileList;
    }
    excludeUnwantedFiles(bp) {
        //exclude files with specific extensions
        if (path.extname(bp.source.path) == ".src") {
            return false;
        }
        return true;
    }
    createArgsFilev1(startDir, noDebug, addEbinsToCodepath, verbose) {
        var result = [];
        if (this.breakPoints) {
            var argsFileContents = "";
            if (!noDebug) {
                let argsModuleName = path.basename(this.argsPrecompiledFileName, ".erl");
                let argsCompiledContents = `-module(${argsModuleName}).\r\n-export([configure/0]).\r\n\r\n`;
                argsCompiledContents += "configure() -> \r\n int:start()\r\n";
                argsFileContents += "-eval 'int:start()";
                var modulesWithoutBp = {};
                this.findErlFiles(startDir).forEach(fileName => {
                    modulesWithoutBp[fileName] = true;
                });
                //first interpret source
                var bps = this.uniqueBy(this.breakPoints, bp => bp.source.path).filter(this.excludeUnwantedFiles);
                bps.forEach(bp => {
                    argsCompiledContents += ",int:ni(\"" + this.formatPath(bp.source.path) + "\")\r\n";
                    delete modulesWithoutBp[bp.source.path];
                });
                for (var fileName in modulesWithoutBp) {
                    argsCompiledContents += ",int:ni(\"" + this.formatPath(fileName) + "\")\r\n";
                }
                //then set break
                this.breakPoints.filter(this.excludeUnwantedFiles).forEach(bp => {
                    var moduleName = path.basename(bp.source.name, ".erl");
                    argsCompiledContents += `,int:break(${moduleName}, ${bp.line})\r\n`;
                });
                this.functionBreakPoints.forEach(bp => {
                    argsCompiledContents += `,vscode_connection:set_breakpoint(${bp.moduleName}, {function, ${bp.functionName}, ${bp.arity}})\r\n`;
                });
                argsFileContents += "'";
                argsCompiledContents += ",ok.";
                if (verbose) {
                    this.debug(`erl file '${this.argsPrecompiledFileName}' was generated with content : -->\n${argsCompiledContents}\n<--`);
                }
                fs.writeFileSync(this.argsPrecompiledFileName, argsCompiledContents);
            }
            if (addEbinsToCodepath) {
                this.findEbinDirs(path.join(startDir, "_build")).forEach(ebin => {
                    argsFileContents += " -pz \"" + this.formatPath(ebin) + "\"";
                });
            }
            fs.writeFileSync(this.argsFileName, argsFileContents);
            result.push("-args_file");
            result.push("\"" + this.argsFileName + "\"");
        }
        return result;
    }
    // old 
    createArgsFilev0(startDir, noDebug, addEbinsToCodepath) {
        var result = [];
        if (this.breakPoints) {
            var argsFileContents = "";
            if (!noDebug) {
                argsFileContents += "-eval 'int:start()";
                var modulesWithoutBp = {};
                this.findErlFiles(startDir).forEach(fileName => {
                    modulesWithoutBp[fileName] = true;
                });
                //first interpret source
                var bps = this.uniqueBy(this.breakPoints, bp => bp.source.path);
                bps.forEach(bp => {
                    argsFileContents += ",int:ni(\\\"" + this.formatPath(bp.source.path) + "\\\")";
                    delete modulesWithoutBp[bp.source.path];
                });
                for (var fileName in modulesWithoutBp) {
                    argsFileContents += ",int:ni(\\\"" + this.formatPath(fileName) + "\\\")";
                }
                //then set break
                this.breakPoints.forEach(bp => {
                    var moduleName = path.basename(bp.source.name, ".erl");
                    argsFileContents += `,int:break(${moduleName}, ${bp.line})`;
                });
                this.functionBreakPoints.forEach(bp => {
                    argsFileContents += `,vscode_connection:set_breakpoint(${bp.moduleName}, {function, ${bp.functionName}, ${bp.arity}})`;
                });
                argsFileContents += "'";
            }
            if (addEbinsToCodepath) {
                this.findEbinDirs(path.join(startDir, "_build")).forEach(ebin => {
                    argsFileContents += " -pz \"" + this.formatPath(ebin) + "\"";
                });
            }
            fs.writeFileSync(this.argsFileName, argsFileContents);
            result.push("-args_file");
            result.push("\"" + this.argsFileName + "\"");
        }
        return result;
    }
    /** compile specific files */
    Compile(startDir, args) {
        //if erl is used, -compile must be used
        //var processArgs = ["-compile"].concat(args);
        var processArgs = [].concat(args);
        var result = this.RunProcess("erlc", startDir, processArgs);
        return result;
    }
    setBreakPointsRequest(bps, fbps) {
        if (!this.started) {
            this.breakPoints = this.breakPoints.concat(bps);
            this.functionBreakPoints = this.functionBreakPoints.concat(fbps);
        }
    }
}
exports.ErlangShellForDebugging = ErlangShellForDebugging;
//# sourceMappingURL=ErlangShellDebugger.js.map