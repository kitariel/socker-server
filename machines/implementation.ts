import express from "express";
import http from "http";
import cors from "cors";

import {
  MachineOptions,
  assign,
  sendParent,
  Sender,
  AnyEventObject,
} from "xstate";

import {
  IContext,
  IConnectionSocketServerEvent,
  ISocketActionConnectionEvent,
  ISocketActionDisconnectionEvent,
  ISendEventToOwnListener,
  ISendEventToKafkaProducerEvent,
} from "./types";

const SOCKET_SERVER = "SOCKET SERVER";
const DATE_START = new Date().toISOString();

export const implementation: MachineOptions<IContext, any> = {
  actions: {
    LogInitializingSocketServer: () => {
      console.log(
        `[${DATE_START}][${SOCKET_SERVER}]: #LogInitializingSocketServer`
      );
    },
    logSocketCreated: () => {
      console.log(`[${DATE_START}][${SOCKET_SERVER}]: #logSocketCreated`);
    },
    logListiningToPort: (_, { payload }: IConnectionSocketServerEvent<any>) => {
      console.log(
        `[${DATE_START}][${SOCKET_SERVER}]: #listining to ${payload.port}`
      );
    },
    logSocketConnection: (
      _,
      { payload }: IConnectionSocketServerEvent<any>
    ) => {
      console.log(
        `[${DATE_START}][${SOCKET_SERVER}]: #socket id ${payload.id}`
      );
    },
    logDisconnectSocketClient: (
      _,
      { payload }: IConnectionSocketServerEvent<any>
    ) => {
      console.log(payload.msg);
    },
    logSocketListener: () => {
      console.log(`[${DATE_START}][${SOCKET_SERVER}]: #logSocketListener`);
    },
    logEmit: () => {
      console.log(`[${DATE_START}][${SOCKET_SERVER}]: #logEmit`);
    },
    logError: (_, { error }) => {
      console.log(`[${DATE_START}][${SOCKET_SERVER}]: #logError ${error}`);
    },

    assignSocketIO: assign({
      io: (_, { payload }: IConnectionSocketServerEvent<any>) => {
        return payload;
      },
    }),
    assignSockerServer: assign({
      socket: (
        _,
        { payload }: IConnectionSocketServerEvent<ISocketActionConnectionEvent>
      ) => {
        return payload.socket;
      },
    }),

    socketEmitResponse: ({ socket }, { payload }) => {
      socket?.emit("API_RESPONSE", payload);
    },

    sendToParent: sendParent(
      (_, { payload }): ISendEventToKafkaProducerEvent<any> => {
        return {
          type: "SEND_TO_TOPIC",
          payload,
        };
      }
    ),
  },
  activities: {},
  delays: {},
  guards: {},
  services: {
    setupSocketServer: ({ socket_config }) => (
      send: Sender<IConnectionSocketServerEvent<any>>
    ) => {
      const app = express();
      app.use(cors());
      const server = http.createServer(app);
      const io = require("socket.io")(server);

      send({
        type: "SERVER_CREATED",
        payload: io,
      });

      server.listen(socket_config.port, () =>
        send({
          type: "SERVER_LISTENING",
          payload: {
            port: socket_config.port,
          },
        })
      );
    },
    activeSocketListener: ({ io }) => (
      send: Sender<
        | IConnectionSocketServerEvent<
            ISocketActionConnectionEvent | ISocketActionDisconnectionEvent | any
          >
        | ISendEventToOwnListener<any>
      >
    ) => {
      io!.on("connection", (socket: any) => {
        //************************** */
        //HANDLER/
        //************************** */
        const connectionHandler = () => {
          send({
            type: "SOCKET_CONNECTION",
            payload: {
              socket,
              id: socket.id,
            },
          });
        };

        const sendToParent = (data: AnyEventObject): void => {
          send({ type: "SEND_TO_PARENT", payload: data });
        };

        const disconnectHandler = (): void => {
          send({
            type: "SOCKET_DISCONNECTION",
            payload: {
              msg: `disconnected:socket_id:${socket.id}`,
            },
          });
        };

        const errorHandler = (error: Error): void => {
          send({
            type: "SOCKET_ERROR",
            payload: null,
            error,
          });
        };

        connectionHandler();

        //************************** */
        //SOCKET/
        //************************** */
        socket.on("TRANSACTION", (data: any) => {
          sendToParent(data);
        });

        socket.on("disconnect", () => {
          disconnectHandler();
        });

        socket.on("error", (error: Error) => {
          errorHandler(error);
        });
      });
    },
  },
};
