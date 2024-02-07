import { useMemo } from "react";
import { ColorValue, StyleSheet, useWindowDimensions } from "react-native";
import { makePaletteColorCallback, useFloroPalette } from "../../floro_infra/contexts/palette/FloroPaletteProvider";
import { Palette, Shade } from "../../floro_infra/floro_modules/palette-generator";
import { makeThemeCallback, useThemeBackground } from "../../floro_infra/contexts/themes/FloroThemesProvider";
import { ColorTheme, useColorTheme } from "../../floro_infra/contexts/themes/ColorThemeProvider";
import { ThemeColors } from "../../floro_infra/floro_modules/themes-generator";

interface InjectedStyles {
  palette: Palette;
  paletteColor: <K extends keyof Palette, S extends keyof Palette[K]>(
    key: K,
    shade: S,
    defaultValue?: string,
  ) => ColorValue;
  colorTheme: ColorTheme;
  themeColor: <K extends keyof ThemeColors>(
    key: K,
    variantKey?: keyof ThemeColors[K]['variants'] | 'default',
    defaultValue?: string,
  ) => ColorValue;
  background: ColorValue;
  width: number;
  height: number;
}

export const createUseStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  stylesCallback: (injected: InjectedStyles) => T,
): () => StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any> => {
  return () => {
    return useStyles(stylesCallback);
  }
};

const useStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  stylesCallback: (injected: InjectedStyles) => T,
) => {

  const { width, height } = useWindowDimensions();
  const palette = useFloroPalette();
  const colorTheme = useColorTheme();
  const paletteColor = useMemo(
    () => makePaletteColorCallback(palette),
    [palette],
  );
  const themeColor = useMemo(() => makeThemeCallback(colorTheme), [colorTheme]);
  const background = useThemeBackground();
  const injectedStyles = useMemo((): InjectedStyles => {
    return {
      palette,
      paletteColor,
      colorTheme,
      themeColor,
      background,
      width,
      height
    } as InjectedStyles;
  }, [palette, colorTheme, paletteColor, themeColor, width, height]);
  return useMemo(() => {
    return StyleSheet.create(stylesCallback(injectedStyles));
  }, [stylesCallback, injectedStyles]);
};

export const usePaletteColor = <K extends keyof Palette, S extends keyof Shade>(
  key: K,
  shade: S,
  defaultValue?: string,
) => {
  const palette = useFloroPalette();
  const paletteColor = useMemo(() => makePaletteColorCallback(palette), []);
  return useMemo(() => {
    return paletteColor(key, shade, defaultValue);
  }, [paletteColor, key, shade, defaultValue]);
};

export const useThemeColor = <K extends keyof ThemeColors>(
  key: K,
  variantKey: keyof ThemeColors[K]['variants'] | 'default' = 'default',
  defaultValue?: string,
) => {
  const colorTheme = useColorTheme();
  const themeColor = useMemo(() => makeThemeCallback(colorTheme), [colorTheme]);
  return useMemo(() => {
    return themeColor(key, variantKey as 'default', defaultValue);
  }, [themeColor, key, variantKey, defaultValue]);
};