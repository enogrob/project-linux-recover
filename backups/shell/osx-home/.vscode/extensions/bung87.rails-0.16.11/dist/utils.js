"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFiles = exports.toPosixPath = exports.flatten = exports.isPositionInString = exports.dectFileType = exports.gitignores = void 0;
const constants_1 = require("./constants");
const vscode_1 = require("vscode");
const path_1 = __importDefault(require("path"));
exports.gitignores = {};
function dectFileType(filePath) {
    for (const [key, value] of constants_1.FileTypeRelPath) {
        if (filePath.indexOf(value) >= 0) {
            return key;
        }
    }
    return constants_1.FileType.Unkown;
}
exports.dectFileType = dectFileType;
function isPositionInString(document, position) {
    const lineText = document.lineAt(position.line).text;
    const lineTillCurrentPosition = lineText.substr(0, position.character);
    // Count the number of double quotes in the line till current position. Ignore escaped double quotes
    let doubleQuotesCnt = (lineTillCurrentPosition.match(/\"/g) || []).length;
    const escapedDoubleQuotesCnt = (lineTillCurrentPosition.match(/\\\"/g) || [])
        .length;
    doubleQuotesCnt -= escapedDoubleQuotesCnt;
    return doubleQuotesCnt % 2 === 1;
}
exports.isPositionInString = isPositionInString;
function flatten(arr) {
    return arr.reduce((flat, toFlatten) => {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
exports.flatten = flatten;
function toPosixPath(s) {
    return s.split(path_1.default.sep).join(path_1.default.posix.sep);
}
exports.toPosixPath = toPosixPath;
/**
 * findFiles in root of document and repect gitignore
 */
function findFiles(document, include, exclude, maxResults, token) {
    const ws = vscode_1.workspace.getWorkspaceFolder(document.uri);
    const name = ws.name;
    const _include = new vscode_1.RelativePattern(ws, toPosixPath(include));
    const _exclude = exports.gitignores[name] && exclude ? exports.gitignores[name].concat(exclude) : exclude;
    return vscode_1.workspace.findFiles(_include, _exclude, maxResults, token);
}
exports.findFiles = findFiles;
