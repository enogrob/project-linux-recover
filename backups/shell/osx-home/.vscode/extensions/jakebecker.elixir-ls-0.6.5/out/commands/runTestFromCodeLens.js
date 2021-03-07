"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function runFromCodeLens(args) {
    const elixirLsTerminal = vscode_1.window.terminals.find(terminal => terminal.name == "ElixirLS") || vscode_1.window.createTerminal("ElixirLS");
    elixirLsTerminal.show();
    elixirLsTerminal.sendText('clear');
    elixirLsTerminal.sendText(buildTestCommand(args));
}
exports.default = runFromCodeLens;
function buildTestCommand(args) {
    const testFilter = buildTestInclude(args.describe, args.testName, args.module);
    return `mix test --exclude test --include "${testFilter}" ${args.filePath}`;
}
function buildTestInclude(describe, testName, module) {
    if (module) {
        return `module:${module}`;
    }
    if (!testName) {
        return `describe:${describe}`;
    }
    if (describe) {
        return `test:test ${describe} ${testName}`;
    }
    return `test:test ${testName}`;
}
//# sourceMappingURL=runTestFromCodeLens.js.map