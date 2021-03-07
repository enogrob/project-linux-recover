"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErlangOutputAdapter = exports.ErlangOutput = void 0;
const vscode = require("vscode");
var erlangOutputChannel;
function ErlangOutput() {
    if (!erlangOutputChannel) {
        erlangOutputChannel = vscode.window.createOutputChannel('erlang');
    }
    return erlangOutputChannel;
}
exports.ErlangOutput = ErlangOutput;
function ErlangOutputAdapter(outputChannel) {
    return new ErlangWrapperOutput(outputChannel || ErlangOutput());
}
exports.ErlangOutputAdapter = ErlangOutputAdapter;
class ErlangWrapperOutput {
    constructor(channel) {
        this.channel = channel;
    }
    show() {
        this.channel.show();
    }
    appendLine(value) {
        this.channel.appendLine(value);
    }
    debug(msg) {
        this.channel.appendLine("debug:" + msg);
    }
}
//# sourceMappingURL=vscodeAdapter.js.map