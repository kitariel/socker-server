import { IContext } from "./types";
export declare const spawn: (context: IContext) => import("xstate").StateMachine<IContext, any, any, {
    value: any;
    context: IContext;
}>;
export declare const Interpret: (context: IContext) => import("xstate").Interpreter<IContext, any, any, {
    value: any;
    context: IContext;
}>;
