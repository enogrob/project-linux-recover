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
exports.PuppetFactsProvider = void 0;
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const telemetry_1 = require("../telemetry");
class PuppetFact extends vscode_1.TreeItem {
    constructor(label, value, collapsibleState, children) {
        super(label, collapsibleState);
        this.label = label;
        this.value = value;
        this.collapsibleState = collapsibleState;
        this.children = children;
        if (children) {
            this.iconPath = vscode_1.ThemeIcon.Folder;
        }
        else {
            this.iconPath = vscode_1.ThemeIcon.File;
        }
    }
    get tooltip() {
        return `${this.label}-${this.value}`;
    }
    get description() {
        return this.value;
    }
}
class PuppetFactsProvider {
    constructor(handler) {
        this.handler = handler;
        this.elements = [];
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        vscode_1.commands.registerCommand('puppet.refreshFacts', () => this.refresh());
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return Promise.resolve(element.children.map((e) => e[1]));
        }
        else {
            return this.getFactsFromLanguageServer();
        }
    }
    getFactsFromLanguageServer() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
              this is problematic because we both store this and return the value
              but this allows us to cache the info for quick expands of the node.
              if we didn't cache, we would have to call out for each expand and getting
              facts is slow.
            */
            yield this.handler.languageClient.onReady();
            const details = yield this.handler.languageClient.sendRequest(new vscode_languageclient_1.RequestType0('puppet/getVersion'));
            if (!details.factsLoaded) {
                // language server is ready, but hasn't loaded facts yet
                return new Promise((resolve) => {
                    let count = 0;
                    const handle = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        count++;
                        if (count >= 60) {
                            clearInterval(handle);
                            const results = yield this.handler.languageClient.sendRequest(new vscode_languageclient_1.RequestType0('puppet/getFacts'));
                            this.elements = this.toList(results.facts);
                            if (telemetry_1.reporter) {
                                telemetry_1.reporter.sendTelemetryEvent('puppetFacts');
                            }
                            resolve(this.elements.map((e) => e[1]));
                        }
                        const details = yield this.handler.languageClient.sendRequest(new vscode_languageclient_1.RequestType0('puppet/getVersion'));
                        if (details.factsLoaded) {
                            clearInterval(handle);
                            const results = yield this.handler.languageClient.sendRequest(new vscode_languageclient_1.RequestType0('puppet/getFacts'));
                            this.elements = this.toList(results.facts);
                            if (telemetry_1.reporter) {
                                telemetry_1.reporter.sendTelemetryEvent('puppetFacts');
                            }
                            resolve(this.elements.map((e) => e[1]));
                        }
                        else {
                            // not ready yet
                        }
                    }), 1000);
                });
            }
            const results = yield this.handler.languageClient.sendRequest(new vscode_languageclient_1.RequestType0('puppet/getFacts'));
            this.elements = this.toList(results.facts);
            if (telemetry_1.reporter) {
                telemetry_1.reporter.sendTelemetryEvent('puppetFacts');
            }
            return this.elements.map((e) => e[1]);
        });
    }
    getParent(element) {
        throw new Error('Method not implemented.');
    }
    toList(data) {
        const things = [];
        for (const key of Object.keys(data)) {
            const value = data[key];
            if (Object.prototype.toString.call(value) === '[object Object]') {
                const children = this.toList(value);
                const item = new PuppetFact(key, value, vscode_1.TreeItemCollapsibleState.Collapsed, children);
                things.push([key, item]);
            }
            else {
                things.push([key, new PuppetFact(key, value.toString(), vscode_1.TreeItemCollapsibleState.None)]);
            }
        }
        return things;
    }
}
exports.PuppetFactsProvider = PuppetFactsProvider;
//# sourceMappingURL=facts.js.map