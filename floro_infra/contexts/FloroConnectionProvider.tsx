import React, { useCallback, useContext, useEffect, useState} from "react";
import { createSocket } from "../helpers/socket";
import { Socket } from "socket.io-client";
import metaFile from "../floro_modules/meta.floro";
import AsyncStorage from "../../src/helpers/AsyncStorageProxy";
import { Platform } from "react-native";

export interface ConnectionInfo {
  tlsPort: number,
  ipAddr: string,
  apiKey: string
}

const FloroConnectionContext = React.createContext<{
  connectionInfo: ConnectionInfo|null
  setConnectionInfo: (_: ConnectionInfo|null) => void;
  socket: Socket|null;
  isConnected: boolean;
  checkingRepo: boolean;
  repoExists: boolean;
  disconnect: () => void;
}>({
  connectionInfo: null,
  setConnectionInfo: (_:ConnectionInfo|null) => {},
  socket: null,
  isConnected: false,
  checkingRepo: false,
  repoExists: false,
  disconnect: () => {},
});
export interface Props {
  children: React.ReactElement;
}

export const FloroConnectionProvider = (props: Props) => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo|null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [checkingRepo, setCheckingRepo] = useState<boolean>(false);
  const [repoExists, setRepoExists] = useState<boolean>(false);
  const [socket, setSocket] = useState<null|Socket>(null);

  const disconnect = useCallback(() => {
    setConnectionInfo(null)
    setIsConnected(false);
    setCheckingRepo(false);
    setRepoExists(false);
    AsyncStorage.removeItem("FLORO_CONNECTION")
  }, [])

  useEffect(() => {
    if (!connectionInfo) {
      setSocket(null);
      setIsConnected(false);
      return;
    }
    const socket = createSocket(connectionInfo);
    setSocket(socket);
    const onOpen = () => {
      setIsConnected(true);
    }
    const onClose = () => {
      setIsConnected(false);
    }
    const onError = (e) => {
      console.log("E", e);
    }
    socket.on("connect", onOpen);
    socket.on("disconnect", onClose);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onOpen);
      socket.off("disconnect", onClose);
      socket.off("error", onError);
    }
  }, [connectionInfo]);

  useEffect(() => {
    /* HYDRATES LAST CONNECTION IF IT EXISTS ON MOUNT */
    let closureIsFresh = true;
    let storedConnection: ConnectionInfo;
    AsyncStorage.getItem("FLORO_CONNECTION").then((storedConnectionString) => {
      if (!closureIsFresh) {
        return null;
      }
      if (!storedConnectionString) {
        return null;
      }
      try {
        storedConnection = JSON.parse(storedConnectionString);

        return fetch(`https://${storedConnection?.ipAddr}:${storedConnection?.tlsPort}/repo/${metaFile.repositoryId}/exists`, {
          headers: {
            authorization: storedConnection?.apiKey ?? ''
          }
        })
      } catch(e) {
        console.log("E", e)
        return null;
      }
    }).then((response) => {
      if (!response) {
        return null;
      }
      if (closureIsFresh) {
        return response.json();
      }
      return null;
    }).then(result => {
      if (!result) {
        return;
      }
      if (closureIsFresh && result?.exists && storedConnection) {
        setConnectionInfo(storedConnection);
      }
    }).catch((e) => {
      // no need to console error
    })
  }, [])

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    let closureIsFresh = true;
    setCheckingRepo(true);
    fetch(`https://${connectionInfo?.ipAddr}:${connectionInfo?.tlsPort}/repo/${metaFile.repositoryId}/exists`, {
      headers: {
        authorization: connectionInfo?.apiKey ?? ''
      }
    }).then((response) => {
      if (!response) {
        return null;
      }
      if (closureIsFresh) {
        return response.json();
      }
      return null;
    }).then(result => {
      if (!result) {
        return;
      }
      if (closureIsFresh) {
        setCheckingRepo(false);
        setRepoExists(result?.exists ?? false)
        AsyncStorage.setItem('FLORO_CONNECTION', JSON.stringify(connectionInfo))
      }
    }).catch(e => {
      if (closureIsFresh) {
        setCheckingRepo(false);
        setRepoExists(false);
      }
    })
    return () => {
      closureIsFresh = false;
    }
  }, [isConnected])


  return (
    <FloroConnectionContext.Provider value={{
      connectionInfo,
      setConnectionInfo,
      isConnected,
      socket,
      checkingRepo,
      repoExists,
      disconnect
    }}>
      {props.children}
    </FloroConnectionContext.Provider>
  );
};

export const useFloroConnection = () => {
    return useContext(FloroConnectionContext);
}