import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function Splash({ navigation }) {
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 3000); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2D30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});