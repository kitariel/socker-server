"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var xstate_1 = require("xstate");
var SOCKET_SERVER = "SOCKET SERVER";
var DATE_START = new Date().toISOString();
exports.implementation = {
    actions: {
        LogInitializingSocketServer: function () {
            console.log("[" + DATE_START + "][" + SOCKET_SERVER + "]: #LogInitializingSocketServer");
        },
        logSocketCreated: function () {
            console.log("[" + DATE_START + "][" + SOCKET_SERVER + "]: #logSocketCreated");
        },
        logListiningToPort: function (_, _a) {
            var payload = _a.payload;
            console.log("[" + DATE_START + "][" + SOCKET_SERVER + "]: #listining to " + payload.port);
        },
        logSocketConnection: function (_, _a) {
            var payload = _a.payload;
            console.log("[" + DATE_START + "][" + SOCKET_SERVER + "]: #socket id " + payload.id);
        },
        logDisconnectSocketClient: function (_, _a) {
            var payload = _a.payload;
            console.log(payload.msg);
        },
        logSocketListener: function () {
            console.log("[" + DATE_START + "][" + SOCKET_SERVER + "]: #logSocketListener");
        },
        logEmit: function () {
            console.log("[" + DATE_START + "][" + SOCKET_SERVER + "]: #logEmit");
        },
        logError: function (_, _a) {
            var error = _a.error;
            console.log("[" + DATE_START + "][" + SOCKET_SERVER + "]: #logError " + error);
        },
        assignSocketIO: xstate_1.assign({
            io: function (_, _a) {
                var payload = _a.payload;
                return payload;
            },
        }),
        assignSockerServer: xstate_1.assign({
            socket: function (_, _a) {
                var payload = _a.payload;
                return payload.socket;
            },
        }),
        socketEmitResponse: function (_a, _b) {
            var socket = _a.socket;
            var payload = _b.payload;
            socket === null || socket === void 0 ? void 0 : socket.emit("API_RESPONSE", payload);
        },
        sendToParent: xstate_1.sendParent(function (_, _a) {
            var payload = _a.payload;
            return {
                type: "SEND_TO_TOPIC",
                payload: payload,
            };
        }),
    },
    activities: {},
    delays: {},
    guards: {},
    services: {
        setupSocketServer: function (_a) {
            var socket_config = _a.socket_config;
            return function (send) {
                var app = express_1.default();
                app.use(cors_1.default());
                var server = http_1.default.createServer(app);
                var io = require("socket.io")(server);
                send({
                    type: "SERVER_CREATED",
                    payload: io,
                });
                server.listen(socket_config.port, function () {
                    return send({
                        type: "SERVER_LISTENING",
                        payload: {
                            port: socket_config.port,
                        },
                    });
                });
            };
        },
        activeSocketListener: function (_a) {
            var io = _a.io;
            return function (send) {
                io.on("connection", function (socket) {
                    var connectionHandler = function () {
                        send({
                            type: "SOCKET_CONNECTION",
                            payload: {
                                socket: socket,
                                id: socket.id,
                            },
                        });
                    };
                    var sendToParent = function (data) {
                        send({ type: "SEND_TO_PARENT", payload: data });
                    };
                    var disconnectHandler = function () {
                        send({
                            type: "SOCKET_DISCONNECTION",
                            payload: {
                                msg: "disconnected:socket_id:" + socket.id,
                            },
                        });
                    };
                    var errorHandler = function (error) {
                        send({
                            type: "SOCKET_ERROR",
                            payload: null,
                            error: error,
                        });
                    };
                    connectionHandler();
                    socket.on("TRANSACTION", function (data) {
                        sendToParent(data);
                    });
                    socket.on("disconnect", function () {
                        disconnectHandler();
                    });
                    socket.on("error", function (error) {
                        errorHandler(error);
                    });
                });
            };
        },
    },
};
