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
exports.PuppetModuleHoverProvider = exports.PuppetModuleHoverFeature = void 0;
const jsonc_parser_1 = require("jsonc-parser");
const vscode = require("vscode");
const forge_1 = require("../forge");
const telemetry_1 = require("../telemetry");
class PuppetModuleHoverFeature {
    constructor(context, logger) {
        this.context = context;
        this.logger = logger;
        const selector = [{ language: 'json', scheme: '*', pattern: '**/metadata.json' }];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        context.subscriptions.push(vscode.languages.registerHoverProvider(selector, new PuppetModuleHoverProvider(logger)));
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispose() { }
}
exports.PuppetModuleHoverFeature = PuppetModuleHoverFeature;
class PuppetModuleHoverProvider {
    constructor(logger) {
        this.logger = logger;
    }
    provideHover(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = document.offsetAt(position);
            const location = jsonc_parser_1.getLocation(document.getText(), offset);
            if (location.isAtPropertyKey) {
                return;
            }
            if (location.path[0] !== 'dependencies') {
                return;
            }
            if (location.path[2] !== 'name') {
                return;
            }
            if (telemetry_1.reporter) {
                telemetry_1.reporter.sendTelemetryEvent('metadataJSON/Hover');
            }
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            this.logger.debug('Metadata hover info found ' + word + ' module');
            const name = word.replace('"', '').replace('"', '').replace('/', '-');
            const info = yield forge_1.getModuleInfo(name, this.logger);
            const markdown = forge_1.buildMarkdown(info);
            const hoverinfo = new vscode.Hover(markdown, range);
            return hoverinfo;
        });
    }
}
exports.PuppetModuleHoverProvider = PuppetModuleHoverProvider;
//# sourceMappingURL=PuppetModuleHoverFeature.js.map