"use strict";
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
const fs = require("fs");
const path = require("path");
const GenericShell_1 = require("./GenericShell");
const ErlangConfigurationProvider_1 = require("./ErlangConfigurationProvider");
/**
 * Provides rebar shell commands. Locates appropriate rebar executable based on provided settings.
 * The exit codes and stdout/stderr outputs are returned.
 */
class RebarShell extends GenericShell_1.GenericShell {
    constructor(rebarSearchPaths, defaultRebarSearchPath, outputChannel) {
        super(outputChannel, new RebarShellOutput(), ErlangConfigurationProvider_1.getElangConfigConfiguration());
        this.rebarSearchPaths = rebarSearchPaths;
        this.defaultRebarSearchPath = defaultRebarSearchPath;
    }
    /**
     * Compile the Erlang apps located at `cwd`.
     *
     * @param cwd - The working directory where compilation will take place
     * @returns Promise resolved or rejected when rebar exits
     */
    compile(cwd) {
        return this.runScript(cwd, ['compile']);
    }
    /**
     * Execute rebar with supplied arguments.
     *
     * @param cwd - The working directory where rebar will be executed
     * @param commands - Arguments to rebar
     * @returns Promise resolved or rejected when rebar exits
     */
    runScript(cwd, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            // Rebar may not have execution permission (e.g. if extension is built
            // on Windows but installed on Linux). Let's always run rebar by escript.
            let escript = (process.platform == 'win32' ? 'escript.exe' : 'escript');
            let rebarFileName = this.getRebarFullPath();
            if (rebarFileName.search(' ') > -1) {
                // There is at least one space in rebarPath. Use double quotes
                // instead of single quotes for cross-operability between
                // Unix shells (e.g. bash) and the Windows shell.
                rebarFileName = ('"' + rebarFileName + '"');
            }
            let args = [rebarFileName].concat(commands);
            this.shellOutput.clear();
            let result;
            try {
                result = yield this.RunProcess(escript, cwd, args);
            }
            catch (exitCode) {
                result = exitCode;
            }
            return wrapProcessExit(result, this.shellOutput.output);
        });
    }
    /**
     * Get the full path to the rebar executable that will be used.
     *
     * @returns Full path to rebar executable
     */
    getRebarFullPath() {
        const rebarSearchPaths = this.rebarSearchPaths.slice();
        if (!rebarSearchPaths.includes(this.defaultRebarSearchPath)) {
            rebarSearchPaths.push(this.defaultRebarSearchPath);
        }
        return this.findBestFile(rebarSearchPaths, ['rebar3', 'rebar'], 'rebar3');
    }
    /**
     * Find the rebar executable to be used based on the order of `dirs` and `filenames` provided.
     * The order defines the priority. `defaultResult` will be used if no executable could be found.
     *
     * @param dirs - Directories to search for one of `fileNames`, in order of priority
     * @param fileNames - Filenames to search in each directory, in order of priority
     * @param defaultResult - Fallback executable path or command if rebar not found
     * @returns Preferred rebar executable path or command
     */
    findBestFile(dirs, fileNames, defaultResult) {
        var result = defaultResult;
        for (var i = 0; i < dirs.length; i++) {
            for (var j = 0; j < fileNames.length; j++) {
                var fullPath = path.normalize(path.join(dirs[i], fileNames[j]));
                if (fs.existsSync(fullPath)) {
                    return fullPath;
                }
            }
        }
        return result;
    }
}
exports.default = RebarShell;
/**
 * Accumulates shell output from processes executed by GenericShell.
 */
class RebarShellOutput {
    constructor() {
        this.output = '';
    }
    append(value) {
        this.output += value;
    }
    clear() {
        this.output = '';
    }
}
const wrapProcessExit = (exitCode, output) => ({
    exitCode,
    output
});
//# sourceMappingURL=RebarShell.js.map