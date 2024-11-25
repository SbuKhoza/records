import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Assuming your AuthContext exports this hook

const CustomHeader = () => {
  const navigation = useNavigation();
  const { logout } = useAuth(); // Assuming your AuthContext provides a logout function

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={handleLogout}
      >
        <Text style={styles.menuText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 10, // Add padding for status bar
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomHeader;