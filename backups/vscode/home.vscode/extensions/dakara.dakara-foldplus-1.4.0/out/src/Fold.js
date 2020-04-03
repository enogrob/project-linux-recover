'use strict';
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
const vscode = require("vscode");
const vscode_extension_common_1 = require("vscode-extension-common");
function foldLevelOfParent() {
    const textEditor = vscode.window.activeTextEditor;
    const selection = textEditor.selection;
    const lineOfReferenceForFold = whenBlankLineUsePreviousOrNextLine(textEditor, selection.anchor.line);
    const parentLine = vscode_extension_common_1.Lines.findNextLineUpSpacedLeft(textEditor.document, lineOfReferenceForFold, +textEditor.options.tabSize);
    const level = vscode_extension_common_1.Lines.calculateLineLevel(textEditor, parentLine.lineNumber);
    textEditor.selection = new vscode.Selection(parentLine.lineNumber, 0, parentLine.lineNumber, 0);
    // vscode.commands.executeCommand('editor.foldLevel' + level)
    //     .then(()=> vscode.commands.executeCommand('editor.fold'));
    foldLevel(textEditor, level, parentLine.lineNumber, textEditor.selection);
}
exports.foldLevelOfParent = foldLevelOfParent;
function foldLevelOfCursor() {
    const textEditor = vscode.window.activeTextEditor;
    const selection = textEditor.selection;
    const lineOfReferenceForFold = whenBlankLineUsePreviousOrNextLine(textEditor, selection.anchor.line);
    const level = vscode_extension_common_1.Lines.calculateLineLevel(textEditor, lineOfReferenceForFold);
    foldLevel(textEditor, level, lineOfReferenceForFold, selection);
}
exports.foldLevelOfCursor = foldLevelOfCursor;
function foldChildren() {
    const textEditor = vscode.window.activeTextEditor;
    const selection = textEditor.selection;
    const linesToFold = vscode_extension_common_1.Lines.findAllLinesSpacedOneLevelRight(textEditor.document, selection.active.line, +textEditor.options.tabSize);
    foldLines(linesToFold.filter(line => vscode_extension_common_1.Lines.isNextLineDownSpacedRight(textEditor.document, line.lineNumber, +textEditor.options.tabSize)).map(line => line.lineNumber));
}
exports.foldChildren = foldChildren;
function foldLines(foldLines) {
    return __awaiter(this, void 0, void 0, function* () {
        const textEditor = vscode.window.activeTextEditor;
        const selection = textEditor.selection;
        let endOfPreviousRegion = -1;
        for (const lineNumber of foldLines) {
            const foldingRegion = vscode_extension_common_1.Region.makeRangeFromFoldingRegion(textEditor.document, lineNumber, +textEditor.options.tabSize);
            // Are we outside previous fold and is current line foldable
            // Executing fold on a non-foldable line will fold the parent
            if ((lineNumber > endOfPreviousRegion) && (foldingRegion.end.line !== lineNumber)) {
                endOfPreviousRegion = foldingRegion.end.line;
                textEditor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
                yield vscode.commands.executeCommand('editor.fold');
                //console.log('folding ' + textEditor.selection.anchor.line);
            }
        }
        textEditor.selection = selection;
        textEditor.revealRange(textEditor.selection, vscode.TextEditorRevealType.InCenter);
    });
}
exports.foldLines = foldLines;
function foldAllExcept(excludedLines) {
    return __awaiter(this, void 0, void 0, function* () {
        const textEditor = vscode.window.activeTextEditor;
        const selection = textEditor.selection;
        yield vscode.commands.executeCommand('editor.foldAll');
        const linesToUnfold = new Set();
        for (const lineNumber of excludedLines) {
            textEditor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
            vscode_extension_common_1.Lines.findLinesByLevelToRoot(textEditor.document, lineNumber, +textEditor.options.tabSize).forEach(line => {
                linesToUnfold.add(line.lineNumber);
            });
            yield vscode.commands.executeCommand('editor.unfoldRecursively');
        }
        for (const lineNumber of Array.from(linesToUnfold)) {
            textEditor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
            yield vscode.commands.executeCommand('editor.unfold');
        }
        textEditor.selection = selection;
        textEditor.revealRange(textEditor.selection, vscode.TextEditorRevealType.InCenter);
    });
}
exports.foldAllExcept = foldAllExcept;
/**
 * If the line on which the command is executed is blank, then we want to use either the
 * previous line or next line with text to determine the correct level.
 * In this event, whichever line (previous or next) is the higher level (further right) will be used.
 *
 * @param editor
 * @param line
 */
function whenBlankLineUsePreviousOrNextLine(editor, line) {
    const currentLine = editor.document.lineAt(line);
    if (!currentLine.isEmptyOrWhitespace)
        return line;
    const nextLineup = vscode_extension_common_1.Lines.findNextLineUp(editor.document, line, line => !line.isEmptyOrWhitespace);
    const nextLineDown = vscode_extension_common_1.Lines.findNextLineDown(editor.document, line, line => !line.isEmptyOrWhitespace);
    const lineUpLevel = vscode_extension_common_1.Lines.calculateLineLevel(editor, nextLineup.lineNumber);
    const lineDownLevel = vscode_extension_common_1.Lines.calculateLineLevel(editor, nextLineDown.lineNumber);
    return lineUpLevel > lineDownLevel ? nextLineup.lineNumber : nextLineDown.lineNumber;
}
function foldLevel(editor, level, lineOfReferenceForFold, originalSelection) {
    if (level < 8) {
        const promises = [];
        promises.push(vscode.commands.executeCommand('editor.foldLevel' + level));
        // Fold current line if it is a foldable line.  If we don't check, vscode will fold parent.
        if (vscode_extension_common_1.Lines.isNextLineDownSpacedRight(editor.document, lineOfReferenceForFold, +editor.options.tabSize))
            promises.push(vscode.commands.executeCommand('editor.fold'));
        // Restore selection
        Promise.all(promises).then(() => {
            editor.selection = originalSelection;
        });
    }
    else {
        const linesToFold = linesByLevel(editor, level);
        foldLines(linesToFold);
    }
}
function linesByLevel(editor, level) {
    const linesToFold = [];
    const levels = vscode_extension_common_1.Lines.calculateAllLineLevels(editor);
    levels.forEach((lineLevel, lineNumber) => {
        if (lineLevel === level) {
            linesToFold.push(lineNumber);
        }
    });
    return linesToFold;
}
//# sourceMappingURL=Fold.js.map