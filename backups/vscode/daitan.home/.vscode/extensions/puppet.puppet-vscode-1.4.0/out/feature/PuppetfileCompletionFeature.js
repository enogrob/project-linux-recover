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
exports.PuppetfileCompletionFeature = exports.PuppetfileCompletionProvider = void 0;
const vscode = require("vscode");
const forge_1 = require("../forge");
class PuppetfileCompletionProvider {
    constructor(logger) {
        this.logger = logger;
    }
    provideCompletionItems(document, position, token, context) {
        return __awaiter(this, void 0, void 0, function* () {
            // get all text until the `position` and check if it reads `mod.`
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.startsWith('mod')) {
                return undefined;
            }
            const completionText = document.getText(document.getWordRangeAtPosition(position));
            const data = yield forge_1.getPuppetModuleCompletion(completionText, this.logger);
            const l = new vscode.CompletionList();
            data.modules.forEach((element) => {
                l.items.push(new vscode.CompletionItem(element, vscode.CompletionItemKind.Module));
            });
            return l;
        });
    }
    resolveCompletionItem(item, token) {
        throw new Error('Method not implemented.');
    }
}
exports.PuppetfileCompletionProvider = PuppetfileCompletionProvider;
class PuppetfileCompletionFeature {
    constructor(context, logger) {
        this.context = context;
        this.logger = logger;
        const selector = [{ scheme: 'file', language: 'puppetfile' }];
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new PuppetfileCompletionProvider(logger)));
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispose() { }
}
exports.PuppetfileCompletionFeature = PuppetfileCompletionFeature;
//# sourceMappingURL=PuppetfileCompletionFeature.js.map