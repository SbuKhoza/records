import React from 'react';
import { View, StyleSheet } from 'react-native';  // Add this import

export default function Recordings() {
  return (
    <View style={styles.mainContainer}>  // Fixed 'styles' typo
        
    </View>
  );
}

const styles = StyleSheet.create({  // Add styles definition
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});