import { Manager } from "socket.io-client";
import { ConnectionInfo } from '../contexts/FloroConnectionProvider';

export const createSocket = (connectionInfo: ConnectionInfo) => {
    const manager = new Manager(`wss://${connectionInfo.ipAddr}:${connectionInfo.tlsPort}`, {
      reconnectionDelayMax: 10000,
      query: {
        client: "external",
        authorization: connectionInfo.apiKey
      }
    });
    return manager.socket("/");
};