// import { Socket, Server } from "socket.io";

export interface IContext {
  socket?: any;
  io?: any;
  socket_config: {
    port: string;
  };
}

export interface IConnectionSocketServerEvent<TPayload> {
  type:
    | "SOCKET_CONNECTION"
    | "SOCKET_DISCONNECTION"
    | "SOCKET_ERROR"
    | "SERVER_CREATED"
    | "SERVER_LISTENING";
  payload: TPayload;
  error?: Error;
}
export interface ISendEventToOwnListener<TPayload> {
  type: "SEND_TO_PARENT" | "RESPONSE";
  payload: TPayload;
}
export interface ISendEventToKafkaProducerEvent<TPayload> {
  type: "SEND_TO_TOPIC";
  payload: TPayload;
}

export interface ISocketActionConnectionEvent {
  socket?: any;
  id: number;
}

export interface ISocketActionDisconnectionEvent {
  msg?: string;
}
