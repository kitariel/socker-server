"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpret = exports.spawn = void 0;
var config_1 = require("./config");
var xstate_1 = require("xstate");
var implementation_1 = require("./implementation");
exports.spawn = function (context) {
    return xstate_1.Machine(__assign(__assign({}, config_1.config), { context: context }), implementation_1.implementation);
};
exports.Interpret = function (context) {
    var machine = exports.spawn(context);
    var service = xstate_1.interpret(machine);
    return service;
};
