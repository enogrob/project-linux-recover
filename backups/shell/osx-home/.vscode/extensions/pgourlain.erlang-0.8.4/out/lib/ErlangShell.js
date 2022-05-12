"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErlangCompilerShell = exports.ErlangShell = void 0;
const GenericShell_1 = require("./GenericShell");
const adapt = require("./vscodeAdapter");
class ErlangShell extends GenericShell_1.GenericShell {
    constructor() {
        super(adapt.ErlangOutputAdapter()); //ErlangShell.ErlangOutput);
    }
    Start(startDir, args) {
        return this.RunProcess("erl", startDir, args);
    }
}
exports.ErlangShell = ErlangShell;
class ErlangCompilerShell extends GenericShell_1.GenericShell {
    constructor() {
        super(adapt.ErlangOutputAdapter()); //ErlangShell.ErlangOutput);
    }
    Start(startDir, args) {
        return this.RunProcess("erlc", startDir, args);
    }
}
exports.ErlangCompilerShell = ErlangCompilerShell;
//# sourceMappingURL=ErlangShell.js.map