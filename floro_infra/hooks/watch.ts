import { useEffect, useState } from "react";
import metaFile from "../meta.floro.json";
import { useFloroDebug } from "../contexts/FloroDebugProvider";
import { useFloroConnection } from "../contexts/FloroConnectionProvider";

export const useWatchFloroState = <T, U, K>(
  repositoryId: string,
  initState: T,
  getJSON?: <T>(
    s: K,
    _?: U,
    m?: "build" | "hot" | "live-update",
    f?: (ref: string) => Promise<string>
  ) => Promise<T>,
): T => {
  const [state, setState] = useState<T>(initState);
  const { isConnected, connectionInfo, repoExists, socket} = useFloroConnection();
  const { isEditMode} = useFloroDebug();

  useEffect(() => {
    let debounce: NodeJS.Timeout;

    if (!socket || !isConnected || !connectionInfo || !repoExists) {
      return;
    }
    const onUpdate = (args: {
      repoId: string;
      binaries: Array<{ fileName: string; url: string; store: K }>;
      store: K;
    }) => {
      const {repoId, binaries, store} = args;
      if (repoId != repositoryId) {
        return;
      }
      const assetAcessor = async (binaryRef: string): Promise<string> => {
        try {
          const fileName = binaries.find(
            (b: { fileName: string }) => b.fileName == binaryRef
          )?.fileName as string;
          const token = binaries.find(
            (b: { fileName: string }) => b.fileName == binaryRef
          )?.url.split("?token=")[1] as string;
          const url = `https://${connectionInfo.ipAddr}:${connectionInfo.tlsPort}/binary/${fileName}?token=${token}`;
          const xhr = new XMLHttpRequest();
          return await new Promise((resolve, reject) => {
            xhr.open("GET", url);
            xhr.onerror = function (e) {
              reject(e);
            };
            xhr.onreadystatechange = function (e) {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                  resolve(xhr.response);
                } else {
                  reject(e);
                }
              }
            };
            xhr.send();
          });
        } catch (e) {
          console.log("E", e);
          return "";
        }
      };
      clearTimeout(debounce);
      debounce = setTimeout(async () => {
        if (getJSON) {
          const nextState = (await getJSON(
            store,
            undefined as U,
            "hot",
            assetAcessor
          )) as T;
          if (nextState != "icons") {
            setState(nextState);
          } else {
            console.log("NEX", nextState)
          }
        }
      }, 100);
    };
    socket.on("state:changed", onUpdate);
    setTimeout(() => {
      socket.emit("trigger-change", {
        repositoryId: metaFile.repositoryId
      })
    }, 100);
    return () => {
      socket.off("state:changed", onUpdate);
    }
  }, [repositoryId, getJSON, socket, isConnected, connectionInfo, repoExists]);
  return isEditMode && isConnected ? state : initState;
};


export const useWatchFloroDebugState = <T, U, K>(
  repositoryId: string,
  getJSON?: <T>(
    s: K,
    _?: U,
    m?: "build" | "hot" | "live-update",
    f?: (ref: string) => Promise<string>
  ) => Promise<T>,
): T|null => {
  const [state, setState] = useState<T|null>(null);
  const { isConnected, connectionInfo, repoExists, socket} = useFloroConnection();
  const { isEditMode} = useFloroDebug();

  useEffect(() => {
    let debounce: NodeJS.Timeout;

    if (!socket || !isConnected || !connectionInfo || !repoExists) {
      return;
    }
    const onUpdate = (args: {
      repoId: string;
      binaries: Array<{ fileName: string; url: string; store: K }>;
      store: K;
    }) => {
      const {repoId, binaries, store} = args;
      if (repoId != repositoryId) {
        return;
      }
      const assetAcessor = async (binaryRef: string): Promise<string> => {
        try {
          const fileName = binaries.find(
            (b: { fileName: string }) => b.fileName == binaryRef
          )?.fileName as string;
          const token = binaries.find(
            (b: { fileName: string }) => b.fileName == binaryRef
          )?.url.split("?token=")[1] as string;
          const url = `https://${connectionInfo.ipAddr}:${connectionInfo.tlsPort}/binary/${fileName}?token=${token}`;
          const xhr = new XMLHttpRequest();
          return await new Promise((resolve, reject) => {
            xhr.open("GET", url);
            xhr.onerror = function (e) {
              reject(e);
            };
            xhr.onreadystatechange = function (e) {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                  resolve(xhr.response);
                } else {
                  reject(e);
                }
              }
            };
            xhr.send();
          });
        } catch (e) {
          console.log("E", e);
          return "";
        }
      };
      clearTimeout(debounce);
      debounce = setTimeout(async () => {
        if (getJSON) {
          const nextState = (await getJSON(
            store,
            undefined as U,
            "hot",
            assetAcessor
          )) as T;
          if (nextState != "icons") {
            setState(nextState);
          } else {
            console.log("NEX", nextState)
          }
        }
      }, 100);
    };
    socket.on("state:changed", onUpdate);
    setTimeout(() => {
      socket.emit("trigger-change", {
        repositoryId: metaFile.repositoryId
      })
    }, 100);
    return () => {
      socket.off("state:changed", onUpdate);
    }
  }, [repositoryId, getJSON, socket, isConnected, connectionInfo, repoExists]);
  return isEditMode && isConnected ? state : null;
};