import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Layout from './Layout';
import LanguageSelectorModal from './screens/LanguageSelectorModal';
import InputModal from './screens/InputModal';
import FloroModalVisionCameraScreen from './screens/FloroModalVisionCameraScreen';

const Stack = createNativeStackNavigator();

const RoutingStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Layout"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Layout" component={Layout} />
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen name="FloroModal" component={FloroModalVisionCameraScreen} />
          <Stack.Screen name="LanguageSelectorModal" component={LanguageSelectorModal} />
          <Stack.Screen name="InputModal" component={InputModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RoutingStack;
