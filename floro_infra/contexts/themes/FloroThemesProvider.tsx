import React, {useContext, useMemo} from 'react';
import metaFile from '../../meta.floro.json';
import initThemes, {
  ThemeColors,
} from '../../floro_modules/themes-generator/index';
import {getJSON} from '@floro/themes-generator';
import {useWatchFloroState} from '../../hooks/watch';
import {ColorTheme} from './ColorThemeProvider';
import { useThemePreference } from './ThemePreferenceProvider';

const FloroThemesContext = React.createContext(initThemes);
export interface Props {
  children: React.ReactElement;
}

export const FloroThemesProvider = (props: Props) => {
  const themes = useWatchFloroState(metaFile.repositoryId, initThemes, getJSON);

  return (
    <FloroThemesContext.Provider value={themes}>
      {props.children}
    </FloroThemesContext.Provider>
  );
};

export const useFloroThemes = () => {
  return useContext(FloroThemesContext);
};

export const makeThemeCallback = <K extends keyof ThemeColors>(
  colorThemes: ColorTheme,
) => {
  return (
    key: K,
    variantKey: keyof ThemeColors[K]['variants'] | 'default' = 'default' as keyof ThemeColors[K]['variants'] | 'default',
    defaultValue?: string,
  ) => {
    if (variantKey && variantKey != 'default') {
      return colorThemes[key]?.['variants']?.[variantKey] ?? 'transparent';
    }
    return colorThemes[key]?.default ?? defaultValue ?? 'transparent';
  };
};


export const useThemeBackground = () => {
  const themes = useFloroThemes();
  const { currentTheme } = useThemePreference();
  return useMemo(() => {
    return themes.themeDefinitions[currentTheme].background;
  }, [themes, currentTheme]);

};