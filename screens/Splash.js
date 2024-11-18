import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


function Splash({ navigation }) {
  useEffect(() => {
    // Set a timer to replace the splash screen with the home screen after 5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home'); 
    }, 5000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.mainSplash}>
      <Image source={require('../assets/logo.png')} style={{ width: 200, height: 200 }} />
    </View>
  );
}

export default Splash;

const styles = StyleSheet.create({
  mainSplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

  },

});