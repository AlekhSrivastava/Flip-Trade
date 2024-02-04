import React, { useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, View, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingScreen = (props) => {
  
  const logoScale = useRef(new Animated.Value(0)).current;

  const moveHome = async () => {
    const isToken = await AsyncStorage.getItem('token');
    setTimeout(() => {
      if (isToken) {
        props.navigation.replace('Home');
      } else {
        props.navigation.replace('Signup');
      }
    }, 2000);
  };

  useEffect(() => {
    const fadeInLogo = Animated.timing(logoScale, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    fadeInLogo.start();
    moveHome(); // Call moveHome directly inside useEffect

    // Removed the unnecessary cleanup code for setTimeout
  }, [props.navigation]); // Make sure to include props.navigation in the dependency array

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#50BDD2" barStyle="light-content" />
      <View style={styles.backgroundContainer}>
        <View style={styles.logoContainer}>
          <Animated.Text style={[styles.logo, { transform: [{ scale: logoScale }] }]}>
            Flip Trade
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A9E1EF',
  },
  backgroundContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  logoContainer: {
    backgroundColor: '#50BDD2',
    padding: 20,
    borderRadius: 10,
    elevation: 3, // for Android shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'YourCustomFont-Bold', // Use a custom font
  },
});

export default LoadingScreen;
