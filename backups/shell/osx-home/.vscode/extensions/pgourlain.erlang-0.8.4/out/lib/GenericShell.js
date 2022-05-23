"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericShell = void 0;
const child_process_1 = require("child_process");
const events_1 = require("events");
const fs = require("fs");
const path = require("path");
//inspired from https://github.com/WebFreak001/code-debug/blob/master/src/backend/mi2/mi2.ts for inspiration of an EventEmitter 
const nonOutput = /^(?:\d*|undefined)[\*\+\=]|[\~\@\&\^]/;
function couldBeOutput(line) {
    if (nonOutput.exec(line))
        return false;
    return true;
}
class GenericShell extends events_1.EventEmitter {
    //provide IGenericShellConfiguration, in order to avoid dependencies on vscode module (it doesn't works with debugger-adpater)
    constructor(logOutput, shellOutput, erlangConfiguration) {
        super();
        this.buffer = "";
        this.errbuf = "";
        this.erlangPath = null;
        this.logOutput = logOutput;
        this.shellOutput = shellOutput;
        // Find Erlang 'bin' directory
        if (erlangConfiguration) {
            let erlangPath = erlangConfiguration.erlangPath;
            if (erlangPath) {
                if (erlangPath.match(/^[A-Za-z]:/)) {
                    // Windows absolute path (C:\...) is applicable on Windows only
                    if (process.platform == 'win32') {
                        this.erlangPath = path.win32.normalize(erlangPath);
                    }
                }
                else {
                    erlangPath = path.normalize(erlangPath);
                    if (!fs.existsSync(erlangPath)) {
                        erlangPath = path.join(erlangConfiguration.rootPath, erlangPath); // vscode.workspace.rootPath, erlangPath);
                    }
                    if (fs.existsSync(erlangPath)) {
                        this.erlangPath = erlangPath;
                    }
                }
            }
        }
    }
    RunProcess(processName, startDir, args) {
        return new Promise((resolve, reject) => {
            this.LaunchProcess(processName, startDir, args).then(started => {
                this.on('close', (exitCode) => {
                    if (exitCode == 0) {
                        resolve(0);
                    }
                    else {
                        reject(exitCode);
                    }
                });
            });
        });
    }
    LaunchProcess(processName, startDir, args, quiet = false) {
        return new Promise((resolve, reject) => {
            try {
                this.logOutput && this.logOutput.show();
                if (!quiet) {
                    if (this.erlangPath) {
                        this.log("log", `using erlang binaries from path : '${this.erlangPath}'`);
                    }
                    this.log("log", `starting : ${processName} \r\n` + args.join(" "));
                }
                var childEnv = null;
                if (this.erlangPath) {
                    childEnv = process.env;
                    var separator = process.platform == 'win32' ? ";" : ":";
                    childEnv.PATH = this.erlangPath + separator + childEnv.PATH;
                }
                this.childProcess = child_process_1.spawn(processName, args, { cwd: startDir, shell: true, stdio: 'pipe', env: childEnv });
                this.childProcess.on('error', error => {
                    this.log("stderr", error.message);
                    if (process.platform == 'win32') {
                        this.log("stderr", "ensure '" + processName + "' is in your path.");
                    }
                });
                this.childProcess.stdout.on('data', this.stdout.bind(this));
                this.childProcess.stderr.on('data', this.stderr.bind(this));
                this.childProcess.on('exit', (exitCode, signal) => {
                    this.log("log", processName + ' exit code:' + exitCode);
                    this.emit('close', exitCode);
                });
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    onOutput(lines) {
        lines = lines.split('\n');
        lines.forEach(line => {
            this.log("stdout", line);
            this.appendToShellOutput(`${line}\n`);
        });
    }
    onOutputPartial(line) {
        if (couldBeOutput(line)) {
            this.logNoNewLine("stdout", line);
            this.appendToShellOutput(line);
            return true;
        }
        return false;
    }
    stdout(data) {
        if (typeof data == "string")
            this.buffer += data;
        else
            this.buffer += data.toString("utf8");
        let end = this.buffer.lastIndexOf('\n');
        if (end != -1) {
            this.onOutput(this.buffer.substr(0, end));
            this.buffer = this.buffer.substr(end + 1);
        }
        if (this.buffer.length) {
            if (this.onOutputPartial(this.buffer)) {
                this.buffer = "";
            }
        }
    }
    stderr(data) {
        if (typeof data == "string")
            this.errbuf += data;
        else
            this.errbuf += data.toString("utf8");
        let end = this.errbuf.lastIndexOf('\n');
        if (end != -1) {
            this.onOutputStderr(this.errbuf.substr(0, end));
            this.errbuf = this.errbuf.substr(end + 1);
        }
        if (this.errbuf.length) {
            this.logNoNewLine("stderr", this.errbuf);
            this.errbuf = "";
        }
    }
    onOutputStderr(lines) {
        lines = lines.split('\n');
        lines.forEach(line => {
            this.log("stderr", line);
            this.appendToShellOutput(line);
        });
    }
    logNoNewLine(type, msg) {
        this.logOutput && this.logOutput.appendLine(msg);
        this.emit("msg", type, msg);
    }
    log(type, msg) {
        this.logOutput && this.logOutput.appendLine(msg);
        this.emit("msg", type, msg[msg.length - 1] == '\n' ? msg : (msg + "\n"));
    }
    debug(msg) {
        this.logOutput && this.logOutput.debug(msg);
    }
    Send(what) {
        this.log("log", what);
        this.childProcess.stdin.write(what);
        this.childProcess.stdin.write('\r\n');
    }
    appendToShellOutput(data) {
        this.shellOutput && this.shellOutput.append(data);
    }
}
exports.GenericShell = GenericShell;
//# sourceMappingURL=GenericShell.js.map