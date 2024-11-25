import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Splash from './screens/Splash';
import Profile from './screens/Profile.js';
import CustomHeader from './components/CustomHeader';
import { AuthProvider } from './context/AuthContext.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={({ route }) => ({
            headerShown: !['Splash', 'Login', 'Signup'].includes(route.name),
            header: () => !['Splash', 'Login', 'Signup'].includes(route.name) ? <CustomHeader /> : null,
            animation: 'slide_from_right'
          })}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}