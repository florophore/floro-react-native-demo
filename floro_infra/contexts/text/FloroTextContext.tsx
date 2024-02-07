import React, { useContext, useEffect, useState } from "react";
import metaFile from "../../floro_modules/meta.floro";
import { LocalizedPhrases } from "../../floro_modules/text-generator";
import initText from "../../floro_modules/text-generator/text.json";
import { getJSON } from "@floro/text-generator";
import { useWatchFloroState } from "../../hooks/watch";
import { syncText } from "../../sync/synctext";
import { IS_DEV_MODE } from "@env";

const FloroTextContext = React.createContext(initText as unknown as LocalizedPhrases);

interface Props {
  children: React.ReactElement;
}

export const FloroTextProvider = (props: Props) => {
  const [text, setText] = useState<LocalizedPhrases>(initText as unknown as LocalizedPhrases);

  useEffect(() => {
    if (IS_DEV_MODE == "TRUE") {
      return;
    }
    let isMounted = true;
    syncText().then(nextText => {
      if (isMounted) {
        setText(nextText)
      }
    });
    return () => {
      isMounted = false;
    }
  }, [])

  const watchedText = useWatchFloroState(metaFile.repositoryId, text, getJSON);
  return (
    <FloroTextContext.Provider value={watchedText}>
      {props.children}
    </FloroTextContext.Provider>
  );
};

export const useFloroText = () => {
  return useContext(FloroTextContext);
};
