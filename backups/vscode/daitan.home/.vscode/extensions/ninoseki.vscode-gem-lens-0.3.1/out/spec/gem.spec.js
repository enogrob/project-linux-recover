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
const gem_1 = require("../gem");
describe("Gem", () => {
    test("initialize", () => {
        const gem = new gem_1.Gem("rails", "~> 1.0");
        expect(gem.name).toBe("rails");
        expect(gem.requirements).toBe("~> 1.0");
    });
    test("info", () => __awaiter(void 0, void 0, void 0, function* () {
        const gem = new gem_1.Gem("rails", "~> 1.0");
        const details = yield gem.details();
        expect(details).toBeDefined();
        if (details) {
            const expectedInfo = "Ruby on Rails is a full-stack web framework optimized for programmer happiness and sustainable productivity. It encourages beautiful code by favoring convention over configuration.";
            expect(details.info).toBe(expectedInfo);
        }
    }));
});
//# sourceMappingURL=gem.spec.js.map