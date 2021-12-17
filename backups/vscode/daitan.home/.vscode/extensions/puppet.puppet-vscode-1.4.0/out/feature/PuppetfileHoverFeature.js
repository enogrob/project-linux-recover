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
exports.PuppetfileHoverFeature = void 0;
// const axios = require('axios');
const vscode = require("vscode");
const forge_1 = require("../forge");
const telemetry_1 = require("../telemetry");
class PuppetfileHoverProvider {
    constructor(logger) {
        this.logger = logger;
    }
    provideHover(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token.isCancellationRequested) {
                return null;
            }
            const range = document.getWordRangeAtPosition(position);
            const line = document.lineAt(position);
            if (line.isEmptyOrWhitespace) {
                return null;
            }
            if (telemetry_1.reporter) {
                telemetry_1.reporter.sendTelemetryEvent('puppetfile/Hover');
            }
            const text = line.text
                .replace(new RegExp('mod\\s+'), '')
                .replace(new RegExp(",\\s+'\\d.\\d.\\d\\'"), '')
                .replace(new RegExp(',\\s+:latest'), '')
                .replace("'", '')
                .replace("'", '');
            const info = yield forge_1.getModuleInfo(text, this.logger);
            const markdown = forge_1.buildMarkdown(info);
            const hoverinfo = new vscode.Hover(markdown, range);
            return hoverinfo;
        });
    }
}
class PuppetfileHoverFeature {
    constructor(context, logger) {
        this.context = context;
        this.logger = logger;
        context.subscriptions.push(vscode.languages.registerHoverProvider('puppetfile', new PuppetfileHoverProvider(logger)));
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispose() { }
}
exports.PuppetfileHoverFeature = PuppetfileHoverFeature;
//# sourceMappingURL=PuppetfileHoverFeature.js.map