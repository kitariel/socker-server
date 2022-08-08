export const config = {
  id: "socket-server-machine",
  initial: "initialize_socket_server",
  states: {
    initialize_socket_server: {
      entry: "LogInitializingSocketServer",
      invoke: {
        src: "setupSocketServer",
      },
      on: {
        SERVER_CREATED: {
          actions: ["assignSocketIO"],
        },
        SERVER_LISTENING: {
          actions: ["logListiningToPort"],
          target: "active",
        },
      },
    },
    active: {
      entry: "logSocketListener",
      invoke: [
        {
          id: "active-socket-listener",
          src: "activeSocketListener",
        },
      ],
      on: {
        SOCKET_CONNECTION: {
          actions: ["logSocketConnection", "assignSockerServer"],
        },
        SOCKET_DISCONNECTION: {
          actions: ["logDisconnectSocketClient"],
        },
        SOCKET_ERROR: {
          actions: ["logError"],
        },
        SEND_TO_PARENT: {
          actions: ["sendToParent"],
        },
        WORKFLOW_RESPONSE: {
          actions: ["socketEmitResponse"],
        },
      },
    },
  },
};
