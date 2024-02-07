import React, { useContext, useMemo, useState} from "react";
import { useFloroConnection } from "../../floro_infra/contexts/FloroConnectionProvider";


const FloroDebugCounterContext = React.createContext<{
  count: number,
  remainingTaps: number,
  isDebuggable: boolean,
  setCount: (_: number) => void,
}>({
  count: 0,
  remainingTaps: 0,
  isDebuggable: false,
  setCount: (_: number) => {},
});
export interface Props {
  children: React.ReactElement;
}

export const FloroDebugCounterProvider = (props: Props) => {
  const [count, setCount] = useState<number>(0);

  const { isConnected} = useFloroConnection();

  const remainingTaps = useMemo(() => {
    return 7 - count
  }, [count]);

  const isDebuggable = useMemo(() => {
      return remainingTaps <= 0 || isConnected
  }, [remainingTaps, isConnected])

  return (
    <FloroDebugCounterContext.Provider value={{
      count,
      setCount,
      remainingTaps,
      isDebuggable
    }}>
      {props.children}
    </FloroDebugCounterContext.Provider>
  );
};

export const useFloroDebugCounter = () => {
    return useContext(FloroDebugCounterContext);
}