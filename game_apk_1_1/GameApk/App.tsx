import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './screens/SignUpScreen';
import SignIn from './screens/SignInScreen';
import Home from './screens/HomeScreen';
import Loading from './screens/LoadingScreen';
import UserScr from './screens/UserScreen';
import Reloading from './screens/ReloadingScreen';
function App() {

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name='Loading' component={Loading} />
        <Stack.Screen name='Signup' component={SignUp} />
        <Stack.Screen name='Signin' component={SignIn} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Reloading' component={Reloading} />
        <Stack.Screen name='User' component={UserScr} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;