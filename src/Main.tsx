import * as React from 'react';
import RoutingStack from './RoutingStack';
import FloroMount from '../floro_infra/contexts/FloroMount';
import {PortalProvider} from '@gorhom/portal';
import * as SplashScreen from 'expo-splash-screen';
import {
  MavenPro_400Regular,
  MavenPro_700Bold,
} from "@expo-google-fonts/maven-pro";
import {
  Raleway_400Regular,
  Raleway_700Bold,
  Raleway_400Regular_Italic,
  Raleway_700Bold_Italic,
} from "@expo-google-fonts/raleway";
import { useFonts } from 'expo-font';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const Main = () => {

  const [fontsLoaded] = useFonts({
    MavenPro_400Regular,
    MavenPro_700Bold,
    Raleway_400Regular,
    Raleway_700Bold,
    Raleway_400Regular_Italic,
    Raleway_700Bold_Italic,
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
      <FloroMount>
        <PortalProvider>
          <View style={{flex: 1}} onLayout={onLayoutRootView}>
            <RoutingStack />
          </View>
        </PortalProvider>
      </FloroMount>
  );
};

export default Main;
