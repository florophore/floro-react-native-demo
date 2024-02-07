import React, { useCallback } from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { createUseStyles, usePaletteColor, useThemeColor } from '../helpers/styleshook';
import { useNavigation } from '@react-navigation/native';

import { useRichText } from '../../floro_infra/hooks/text';
import { useFloroDebugCounter } from '../contexts/DebugCounterContext';
import { useIcon } from '../helpers/icons';


const HomeScreen = () => {
  const styles = useStyles();
  const navigation = useNavigation();

  const {count, setCount, remainingTaps, isDebuggable} = useFloroDebugCounter();

  const onIncreaseCount = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  const FloroWithIcon = useIcon("main.floro-with-text");

  const contrastText = useThemeColor("contrast-text")
  const contrastGray = useThemeColor("contrast-gray")
  const white = usePaletteColor("white", "regular");

  const WelcomeToFloro = useRichText("home_screen.welcome_to_demo");
  const TapInstructions = useRichText("home_screen.tap_to_unlock_debug");

  const UnlockedText = useRichText("home_screen.debug_mode_unlocked");

  const ViewStringExamples = useRichText("home_screen.view_string_examples");

  const onGoToExamples = useCallback(() => {
    navigation.navigate('ExampleStringsScreen' as never)
  }, [])

  return (
    <View style={styles.main}>
      <View style={styles.top}>
        <FloroWithIcon width={"60%"} height={"70%"} />
        {!isDebuggable && (
          <TouchableOpacity onPress={onIncreaseCount}>
            <View>
              <WelcomeToFloro
                textStyles={styles.textCenter}
                richTextOptions={{
                  fontSize: 22,
                  color: contrastText,
                }}
              />
              <View style={styles.instructionsWrapper}>
                <TapInstructions
                  textStyles={styles.textCenter}
                  remainingTaps={remainingTaps}
                  richTextOptions={{
                    fontSize: 18,
                    color: contrastGray,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        {isDebuggable && (
          <>
            <View>
              <WelcomeToFloro textStyles={styles.textCenter}
                  richTextOptions={{
                    fontSize: 22,
                    color: contrastText,
                  }}
              />
              <View style={styles.instructionsWrapper}>
                <Text style={styles.textCenter}>
                  <UnlockedText
                    richTextOptions={{
                      fontSize: 18,
                      color: contrastGray,
                    }}
                  />
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity activeOpacity={0.8} onPress={onGoToExamples}>
          <View style={styles.bottomButton}>
            <Text>
              <ViewStringExamples
                richTextOptions={{
                  fontSize: 24,
                  color: white,
                }}
              />
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useStyles = createUseStyles(({paletteColor, background}) => ({
  main: {
    backgroundColor: background,
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  top: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '75%'
  },
  topIcon: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  instructionsWrapper: {
    marginTop: 12,
    width: '80%',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
    alignContent: 'center',
  },
  bottom: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 12
  },
  bottomButton: {
    height: 72,
    width: '100%',
    backgroundColor: paletteColor('orange', 'regular'),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: paletteColor('orange', 'dark'),
    shadowColor: paletteColor('orange', 'light'),
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default React.memo(HomeScreen);