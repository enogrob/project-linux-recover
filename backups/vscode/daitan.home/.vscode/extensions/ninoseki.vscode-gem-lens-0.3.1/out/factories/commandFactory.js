"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = void 0;
const common_1 = require("../common");
const extractDependency_1 = require("../extractDependency");
const gem_1 = require("../gem");
async function createCommand(lineText) {
    const dependency = extractDependency_1.extractDependency(lineText);
    if (!dependency) {
        return;
    }
    const gem = new gem_1.Gem(dependency.name, dependency.requirements);
    if (!common_1.cache.has(gem.name)) {
        const details = await gem.details();
        if (details !== undefined) {
            common_1.cache.set(gem.name, details);
        }
    }
    const details = common_1.cache.get(gem.name);
    if (details === undefined) {
        return;
    }
    const command = {
        title: `The latest version: ${details.version}`,
        command: "gem-lens.onclick",
    };
    return command;
}
exports.createCommand = createCommand;
//# sourceMappingURL=commandFactory.js.map