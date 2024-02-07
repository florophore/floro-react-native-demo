
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { createUseStyles } from '../helpers/styleshook';
import { usePlainText } from '../../floro_infra/hooks/text';
import { useThemePreference } from '../../floro_infra/contexts/themes/ThemePreferenceProvider';
import { useThemeBackground } from '../../floro_infra/contexts/themes/FloroThemesProvider';
import { useFloroDebugCounter } from '../contexts/DebugCounterContext';
import { useFloroDebug } from '../../floro_infra/contexts/FloroDebugProvider';
import { useFloroConnection } from '../../floro_infra/contexts/FloroConnectionProvider';
import { useIcon } from '../helpers/icons';

interface Props {
    onOpenLanguages: () => void;
    onOpenDebug: () => void;
}

const Header = (props: Props) => {

    const {currentTheme, selectColorTheme} = useThemePreference()

    const styles = useStyles();
    const themeBackground = useThemeBackground();
    const RoundIcon = useIcon("front-page.floro-round");
    const debugFloroText = usePlainText(
      'header.debug_floro',
    );
    const MoonIcon = useIcon("front-page.moon");
    const SunIcon = useIcon("front-page.sun");
    const LanguageIcon = useIcon("front-page.language");
    const DropDownArrow = useIcon("front-page.drop-down-arrow");

    const themeTranslateX = useRef(new Animated.Value(currentTheme == 'dark' ? 40 : 0)).current;
    const { isDebuggable } = useFloroDebugCounter();
    const { isEditMode } = useFloroDebug();
    const {isConnected} = useFloroConnection();

    useEffect(() => {
        if (currentTheme == 'dark') {
            Animated.timing(themeTranslateX, {
                toValue: 40,
                duration: 300,
                useNativeDriver: true,
              }).start();
        } else {
            Animated.timing(themeTranslateX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start();
        }
    }, [currentTheme])

    const ThemeIcon = useMemo(() => {
        if (currentTheme == 'dark') {
            return MoonIcon
        }
        return SunIcon;
    }, [currentTheme, MoonIcon, SunIcon]);

    const onToggleTheme = useCallback(() => {
        selectColorTheme(currentTheme == 'light' ? 'dark' : 'light');
    }, [currentTheme])

    return (
        <View style={styles.container}>
            <View style={styles.headContainer}>
                <View style={styles.leftContainer}>
                    <RoundIcon height={56}/>
                    {isDebuggable && (
                        <TouchableOpacity style={{zIndex: 200}} onPress={props.onOpenDebug}>
                          <View style={styles.row}>
                            <Text style={styles.debugButton}>{debugFloroText}</Text>
                            {isEditMode && isConnected && (
                              <View style={styles.debugCircle}/>
                            )}
                          </View>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.rightContainer}>
                    <TouchableOpacity onPress={onToggleTheme}>
                        <View style={styles.themeSwitcherContainer}>
                            <View style={styles.themeInnerContainer}>
                                <Animated.View style={{
                                    ...styles.themeCircle,
                                    backgroundColor: themeBackground,
                                    transform: [{
                                        translateX: themeTranslateX
                                    }]
                                }}>
                                    <ThemeIcon width={14} height={14}/>
                                </Animated.View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider}/>
                    <TouchableOpacity onPress={props.onOpenLanguages}>
                        <View style={styles.languageSwitcherContainer}>
                            <LanguageIcon width={24} height={24}/>
                            <DropDownArrow width={24} height={24}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const useStyles = createUseStyles(({paletteColor, themeColor, background}) => ({
  container: {
    height: 72,
    width: '100%',
  },
  headContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugButton: {
    marginLeft: 12,
    color: paletteColor('blue', 'regular'),
    fontSize: 16,
    fontWeight: 'bold'
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeSwitcherContainer: {
    alignItems: 'center',
    width: 72,
    height: 32,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: themeColor('purple-theme'),
  },
  themeInnerContainer: {
    position: 'relative',
    width: 70,
    height: 30,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: background,
    borderColor: themeColor('purple-inverse-theme'),
    shadowColor: themeColor('purple-theme'),
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 4,
  },
  themeCircle: {
    top: 2,
    left: 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: themeColor('purple-theme'),
  },
  divider: {
    marginHorizontal: 8,
    width: 1,
    height: 32,
    backgroundColor: paletteColor('gray', 'light')
  },
  languageSwitcherContainer: {
    width: 56,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugCircle: {
    backgroundColor: paletteColor('teal', 'regular'),
    height: 16,
    width: 16,
    marginLeft: 8,
    borderRadius: 8,
    shadowColor: themeColor("teal-contrast"),
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 4,
  }
}));

export default React.memo(Header);