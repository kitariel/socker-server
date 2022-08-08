export declare const config: {
    id: string;
    initial: string;
    states: {
        initialize_socket_server: {
            entry: string;
            invoke: {
                src: string;
            };
            on: {
                SERVER_CREATED: {
                    actions: string[];
                };
                SERVER_LISTENING: {
                    actions: string[];
                    target: string;
                };
            };
        };
        active: {
            entry: string;
            invoke: {
                id: string;
                src: string;
            }[];
            on: {
                SOCKET_CONNECTION: {
                    actions: string[];
                };
                SOCKET_DISCONNECTION: {
                    actions: string[];
                };
                SOCKET_ERROR: {
                    actions: string[];
                };
                SEND_TO_PARENT: {
                    actions: string[];
                };
                WORKFLOW_RESPONSE: {
                    actions: string[];
                };
            };
        };
    };
};
