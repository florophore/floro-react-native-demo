import React, { useCallback } from 'react';
import { View } from 'react-native';
import { createUseStyles } from './helpers/styleshook';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';
import { useNavigation } from '@react-navigation/native';
import ScreenStack from './ScreenStack';
import { FloroDebugCounterProvider } from './contexts/DebugCounterContext';
import { useThemeBackground } from '../floro_infra/contexts/themes/FloroThemesProvider';

const Layout = () => {

    const styles = useStyles();
    const navigation = useNavigation();
    const themeBackground = useThemeBackground();


    const onOpenDebug = useCallback(() => {
        navigation.navigate('FloroModal' as never)
    }, []);
    const onOpenLanguages = useCallback(() => {
        navigation.navigate('LanguageSelectorModal' as never)

    }, []);
    return (
    <FloroDebugCounterProvider>
      <View style={styles.main}>
        <SafeAreaView style={styles.safeArea}>
          <Header onOpenDebug={onOpenDebug} onOpenLanguages={onOpenLanguages} />
          <View style={{flexGrow: 1, width: '100%', backgroundColor: themeBackground}}>
            <ScreenStack/>
          </View>
        </SafeAreaView>
      </View>
    </FloroDebugCounterProvider>
    );
}

const useStyles = createUseStyles(({background}) => ({
    main: {
        height: '100%',
        width: '100%',
        backgroundColor: background
    },
    safeArea: {
        height: "100%",
        width: "100%",
        flexDirection: "column"
    }
}))

export default React.memo(Layout);