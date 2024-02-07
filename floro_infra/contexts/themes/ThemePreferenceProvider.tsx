import React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import initThemes from '../../floro_modules/themes-generator/themes.json';
import {ThemeSet} from '../../floro_modules/themes-generator';
import { useColorScheme } from 'react-native';
import AsyncStorage from '../../../src/helpers/AsyncStorageProxy';

const defaultTheme: keyof ThemeSet = 'light';

const ThemePreferenceContext = createContext<{
  selectColorTheme: (themePreference: 'system' | keyof ThemeSet) => void;
  themePreference: 'system' | keyof ThemeSet;
  currentTheme: keyof ThemeSet;
}>({
  themePreference: 'system',
  selectColorTheme: (_themePreference: 'system' | keyof ThemeSet) => {},
  currentTheme: Object.keys(initThemes?.themeDefinitions)?.[0] as keyof ThemeSet ?? defaultTheme
});

interface Props {
  children: React.ReactElement;
}

export const ThemePreferenceProvider = (props: Props): React.ReactElement => {
  const [themePreference, setThemePreference] = useState<
    'system' | keyof ThemeSet
  >('system');

  useEffect(() => {
    let closureIsFresh = true;
    AsyncStorage.getItem('theme-preference').then(
      (storedPreference: string | null) => {
        if (closureIsFresh) {
          setThemePreference(
            (storedPreference as keyof ThemeSet | 'system') ?? 'system',
          );
        }
      },
    );
    return () => {
      closureIsFresh = false;
    };
  }, []);

  const selectColorTheme = useCallback(
    (themePreference: 'system' | keyof ThemeSet) => {
      setThemePreference(themePreference);
      AsyncStorage.setItem('theme-preference', themePreference);
    },
    [],
  );

  const rnSystemColorScheme = useColorScheme();
  const currentTheme = useMemo(() => {
    if (themePreference == 'system') {
        if (!rnSystemColorScheme) {
            return (
              (
                Object.keys(initThemes.themeDefinitions) as Array<
                  keyof ThemeSet
                >
              )?.[0] ??
              (initThemes.themeDefinitions[
                defaultTheme
              ] as unknown as keyof ThemeSet)
            );
        }
        return initThemes.themeDefinitions[rnSystemColorScheme as keyof ThemeSet]?.name as keyof ThemeSet;
    }
    return themePreference as keyof ThemeSet;

  }, [themePreference, rnSystemColorScheme])

  return (
    <ThemePreferenceContext.Provider
      value={{
        themePreference,
        selectColorTheme,
        currentTheme
      }}>
      {props.children}
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreference = () => {
  return useContext(ThemePreferenceContext);
};
