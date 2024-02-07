import React, {useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {createUseStyles} from '../helpers/styleshook';
import {useFloroLocales} from '../../floro_infra/contexts/text/FloroLocalesContext';
import {Locales} from '../../floro_infra/floro_modules/text-generator';

interface LocaleProps {
  locale: Locales[keyof Locales];
}

const LocaleSelect = (props: LocaleProps) => {
  const styles = useStyles();
  const {setSelectedLocaleCode, selectedLocaleCode} = useFloroLocales();
  const onPress = useCallback(() => {
    if (!props?.locale?.localeCode) {
        return;
    }
    setSelectedLocaleCode(props?.locale?.localeCode as keyof Locales);
  }, [props.locale]);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{marginBottom: 12}}>
        {selectedLocaleCode == props.locale?.localeCode && (
          <Text style={styles.localeTextSelected}>{props.locale?.name}</Text>
        )}
        {selectedLocaleCode != props.locale?.localeCode && (
          <Text style={styles.localeText}>{props.locale?.name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const useStyles = createUseStyles(({themeColor, paletteColor}) => {
  return {
    localeText: {
      fontFamily: 'MavenPro_Regular400',
      color: themeColor('contrast-text-light'),
      fontSize: 24,
    },
    localeTextSelected: {
      fontFamily: 'MavenPro_Regular400',
      color: paletteColor('blue', 'regular'),
      fontSize: 24,
      fontWeight: "bold"
    },
  };
});

export default React.memo(LocaleSelect);
