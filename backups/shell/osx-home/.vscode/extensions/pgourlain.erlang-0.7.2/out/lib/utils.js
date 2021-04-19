"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keysFromDictionary = void 0;
///
/// get keys from a dictionary
///
function keysFromDictionary(dico) {
    var keySet = [];
    for (var prop in dico) {
        if (dico.hasOwnProperty(prop)) {
            keySet.push(prop);
        }
    }
    return keySet;
}
exports.keysFromDictionary = keysFromDictionary;
//# sourceMappingURL=utils.js.map