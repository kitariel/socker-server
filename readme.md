# XState Socket Server Machine

## Description

A spawnable Socket Server that enables inter-xstate-machine communication between multiple client.

## Context

Keys of the context of this state machine.

```typescript
export interface IContext {
  socket?: any;
  io?: any;
  socket_config: {
    port: string;
  };
}
```

## Events

### Machine to Parent

**EventServer** - Send this event to this machine to send "event" to another initialize server

```typescript
interface IConnectionSocketServerEvent<TPayload> {
  type:
    | "SOCKET_CONNECTION"
    | "SOCKET_DISCONNECTION"
    | "SOCKET_ERROR"
    | "SERVER_CREATED"
    | "SERVER_LISTENING";
  payload: TPayload;
  error?: Error;
}
```

**EventSendListiner** - Sending to parent to trigger an event called sendtotopic from kafkabus to produce data , Response event from consumer

```typescript
interface ISendEventToOwnListener<TPayload> {
  type: "SEND_TO_PARENT" | "RESPONSE";
  payload: TPayload;
}
```

**EventProducer** - Send to topic : produce to kafka

```typescript
interface ISendEventToKafkaProducerEvent<TPayload> {
  type: "SEND_TO_TOPIC";
  payload: TPayload;
}
```
