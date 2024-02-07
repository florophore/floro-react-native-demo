import React, { useContext} from "react";
import metaFile from "../../meta.floro.json";
import initPalette, { Palette } from "../../floro_modules/palette-generator/index";
import { useWatchFloroState } from "../../hooks/watch";
import { getJSON } from '@floro/palette-generator'


const FloroPaletteContext = React.createContext(initPalette);
export interface Props {
  children: React.ReactElement;
}

export const FloroPaletteProvider = (props: Props) => {
  const palette = useWatchFloroState(metaFile.repositoryId, initPalette, getJSON);

  return (
    <FloroPaletteContext.Provider value={palette}>
      {props.children}
    </FloroPaletteContext.Provider>
  );
};

export const useFloroPalette = () => {
    return useContext(FloroPaletteContext);
}

export const makePaletteColorCallback = <K extends keyof Palette, S extends keyof Palette[K]>(palette: Palette) => {
    return (key: K, shade: S, defaultValue?: string) => {
        return palette[key][shade] ?? defaultValue ?? 'transparent';
    }
}