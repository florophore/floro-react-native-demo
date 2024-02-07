import React, { useContext, useMemo, useState} from "react";
import { useFloroConnection } from "./FloroConnectionProvider";


const FloroDebugContext = React.createContext<{
  isDebugMode: boolean,
  setIsDebugMode: (_: boolean) => void,
  isEditMode: boolean,
  setIsEditMode: (_: boolean) => void,
  showDebugMode: boolean
}>({
  isDebugMode: false,
  setIsDebugMode: (_: boolean) => {},
  isEditMode: false,
  setIsEditMode: (_: boolean) => {},
  showDebugMode: false,
});
export interface Props {
  children: React.ReactElement;
}

export const FloroDebugProvider = (props: Props) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false);


  const { isConnected } = useFloroConnection();

  const showDebugMode = useMemo(() => {
    return isEditMode && isDebugMode && isConnected;
  }, [isEditMode, isDebugMode, isConnected]);

  return (
    <FloroDebugContext.Provider value={{
      isDebugMode,
      setIsDebugMode,
      isEditMode,
      setIsEditMode,
      showDebugMode
    }}>
      {props.children}
    </FloroDebugContext.Provider>
  );
};

export const useFloroDebug = () => {
    return useContext(FloroDebugContext);
}

export const useIsDebugMode = () => {
    return useContext(FloroDebugContext);
}