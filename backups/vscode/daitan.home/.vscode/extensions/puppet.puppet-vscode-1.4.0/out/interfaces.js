'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionStatus = void 0;
// Only add simple interfaces here. No import's allowed
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["NotStarted"] = 0] = "NotStarted";
    ConnectionStatus[ConnectionStatus["Starting"] = 1] = "Starting";
    ConnectionStatus[ConnectionStatus["RunningLoading"] = 2] = "RunningLoading";
    ConnectionStatus[ConnectionStatus["RunningLoaded"] = 3] = "RunningLoaded";
    ConnectionStatus[ConnectionStatus["Stopping"] = 4] = "Stopping";
    ConnectionStatus[ConnectionStatus["Failed"] = 5] = "Failed";
    ConnectionStatus[ConnectionStatus["Stopped"] = 6] = "Stopped";
    ConnectionStatus[ConnectionStatus["Initializing"] = 7] = "Initializing";
    ConnectionStatus[ConnectionStatus["InitializationComplete"] = 8] = "InitializationComplete";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
//# sourceMappingURL=interfaces.js.map