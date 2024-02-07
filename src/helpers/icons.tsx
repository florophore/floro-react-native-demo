import { useCallback } from "react";
import { useFloroIcons } from "../../floro_infra/contexts/icons/FloroIconsProvider";
import { useThemePreference } from "../../floro_infra/contexts/themes/ThemePreferenceProvider";
import { Icons } from "../../floro_infra/floro_modules/icon-generator/types";
import { SvgProps } from "react-native-svg";

interface IconCallback<T extends keyof Icons> extends SvgProps {
  variant?: string & keyof Icons[T]["variants"];
}

export const useIcon = <T extends keyof Icons>(key: T) => {
  const { currentTheme } = useThemePreference();
  const icons = useFloroIcons();
  return useCallback(
    ({ variant, ...rest }: IconCallback<T>) => {
      const icon = icons[key] as Icons[T];
      if (
        variant &&
        icon?.variants &&
        icon.variants[variant as keyof typeof icon.variants]
      ) {
        const variantValues =
          icon.variants[variant as keyof typeof icon.variants];
        const IC = variantValues[currentTheme] as React.FC<SvgProps>;
        return <IC {...rest}/>;
      }
      const IC =  icons?.[key]?.default?.[
        currentTheme
      ] as unknown as React.FC<SvgProps>;
     return <IC {...rest}/>;
    },
    [key, currentTheme]
  );
};