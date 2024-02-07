import React, {useContext, useMemo} from 'react';
import {
  ThemeColors,
  ThemeSet,
} from '../../floro_modules/themes-generator/index';
import {useFloroThemes} from './FloroThemesProvider';
import {useThemePreference} from './ThemePreferenceProvider';

export declare type ColorTheme = Record<
  keyof ThemeColors,
  {
    default: string | null;
    variants: Record<
      keyof (keyof ThemeColors[keyof ThemeColors]['variants']),
      string | null
    >;
  }
>;

const ColorThemeContext = React.createContext<ColorTheme>({} as ColorTheme);
export interface Props {
  children: React.ReactElement;
}

export const ColorThemeProvider = (props: Props) => {
  const themes = useFloroThemes();

  const {currentTheme} = useThemePreference();

  const themeModes = useMemo(() => {
    return (
      Object.keys(themes.themeDefinitions) as Array<keyof ThemeSet>
    ).reduce((acc, themeKey) => {
      return {
        ...acc,
        [themeKey]: (
          Object.keys(themes.themeColors) as Array<keyof ThemeColors>
        ).reduce((acc, themeDefKey) => {
          const themeObj = themes.themeColors[themeDefKey];
          return {
            ...acc,
            [themeDefKey]: {
              default: themeObj.default[themeKey] as string | null,
              variants: (
                Object.keys(themeObj.variants) as Array<
                  keyof typeof themeObj.variants
                >
              ).reduce((acc, themeVariantKey) => {
                return {
                  ...acc,
                  [themeVariantKey]:
                    themeObj.variants[themeVariantKey][themeDefKey],
                };
              }, {} as Record<keyof (keyof typeof themeObj.variants), string | null>),
            },
          };
        }, {} as ColorTheme),
      };
    }, {} as Record<keyof ThemeSet, ColorTheme>);
  }, [themes.themeColors, themes.themeDefinitions]);

  const colorThemes = useMemo(() => {
    return themeModes[currentTheme];
  }, [currentTheme, themeModes]);

  return (
    <ColorThemeContext.Provider value={colorThemes}>
      {props.children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => {
  return useContext(ColorThemeContext);
};
