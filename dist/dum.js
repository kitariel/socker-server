"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var index_1 = require("./index");
var service = xstate_1.interpret(index_1.spawn({
    socket_config: {
        cost: 100,
        port: "3095",
    },
}));
service.start();
