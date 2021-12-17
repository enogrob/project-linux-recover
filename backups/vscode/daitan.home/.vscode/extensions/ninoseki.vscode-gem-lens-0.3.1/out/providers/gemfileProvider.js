"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GemfileProvider = void 0;
const abstractProvider_1 = require("./abstractProvider");
class GemfileProvider extends abstractProvider_1.AbstractProvider {
    gemRegexp() {
        return /\bgem( |"|')/;
    }
}
exports.GemfileProvider = GemfileProvider;
//# sourceMappingURL=gemfileProvider.js.map