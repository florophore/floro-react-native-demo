import React, {useContext, useMemo} from 'react';
import metaFile from '../../meta.floro.json';
import initIcons from '../../floro_modules/icon-generator/index';
import {getJSON} from '@floro/icon-generator';
import {useWatchFloroDebugState} from '../../hooks/watch';
import {Icons} from '../../floro_modules/icon-generator/types';
import {SvgProps, SvgXml} from 'react-native-svg';

const getRawXML = (iconEncoded: string) => {
  const urlEncoded = iconEncoded.split('data:image/svg+xml,')[1];
  return decodeURIComponent(urlEncoded);
};

const FloroIconsContext = React.createContext(initIcons);
export interface Props {
  children: React.ReactElement;
}

export const FloroIconsProvider = (props: Props) => {
  const rawDebugIcons = useWatchFloroDebugState(metaFile.repositoryId, getJSON);

  const icons = useMemo(() => {
    if (!rawDebugIcons) {
      return initIcons;
    }
    let out: Icons = {...initIcons};
    for (const iconName in rawDebugIcons as object) {
      const name = iconName as keyof Icons;
      let _icon = {...initIcons[name]};
      let _default = {..._icon.default};
      let _variants = {..._icon.variants};

      for (const themeName in (rawDebugIcons as Icons)[name].default) {
        const str = (rawDebugIcons as Icons)[name].default[
          themeName as keyof typeof _default
        ];
        const xml = getRawXML(str);
        const icon = (props: SvgProps) => <SvgXml xml={xml} {...props} />;
        _default[themeName as keyof typeof _default] =
          icon as unknown as string;
      }
      for (const variantName in _variants) {
        const variant = {
          ...(_variants[
            variantName as keyof typeof _variants
          ] as typeof _default),
        };
        for (const themeName in variant) {
          const str = (
            (rawDebugIcons as Icons)[name].variants as Record<
              string,
              typeof _default
            >
          )[variantName][themeName as keyof typeof _default];
          const xml = getRawXML(str);
          const icon = (props: SvgProps) => <SvgXml xml={xml} {...props} />;
          variant[themeName as keyof typeof _default] =
            icon as unknown as string;
        }
        _variants[variantName as keyof typeof _variants] = variant as never;
      }
      out[name as keyof Icons] = {
        default: _default,
        variants: _variants as never,
      };
    }
    return out;
  }, [rawDebugIcons]);

  return (
    <FloroIconsContext.Provider value={icons as Icons}>
      {props.children}
    </FloroIconsContext.Provider>
  );
};

export const useFloroIcons = () => {
  return useContext(FloroIconsContext);
};
