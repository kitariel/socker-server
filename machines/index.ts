import { IContext } from "./types";
import { config } from "./config";
import { Machine, interpret } from "xstate";
import { implementation } from "./implementation";

export const spawn = (context: IContext) =>
  // @ts-ignore
  Machine({ ...config, context }, implementation);

export const Interpret = (context: IContext) => {
  const machine = spawn(context);
  const service = interpret(machine);
  return service;
};
