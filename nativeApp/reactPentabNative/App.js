/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import UDPProvider from './src/context/udp';
import {ScanBarcode, TouchArea, Home} from './src/screen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UDPProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="ScanBarcode"
            component={ScanBarcode}
            options={{headerShown: false}}
          />
          <Stack.Screen name="TouchArea" component={TouchArea} />
        </Stack.Navigator>
      </NavigationContainer>
    </UDPProvider>
  );
}
