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
exports.Gem = void 0;
const axios_cache_adapter_1 = require("axios-cache-adapter");
const api = axios_cache_adapter_1.setup({
    baseURL: "https://rubygems.org",
});
class Gem {
    constructor(name, requirements) {
        this.name = name;
        this.requirements = requirements;
    }
    details() {
        return __awaiter(this, void 0, void 0, function* () {
            const path = `/api/v1/gems/${this.name}.json`;
            const res = yield api.get(path);
            if (res.status === 200) {
                return res.data;
            }
            return undefined;
        });
    }
}
exports.Gem = Gem;
//# sourceMappingURL=gem.js.map