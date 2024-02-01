import React, { useEffect, useRef } from 'react';
import { StatusBar,View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';


const LoadingScreen = () => {
  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeInLogo = Animated.timing(logoScale, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    fadeInLogo.start();

    const fakeAsyncTask = setTimeout(() => {
      // Simulate the completion of an asynchronous task (e.g., data fetching)
      // Replace the following line with your navigation logic to the main screen
      // navigation.navigate('MainScreen');
    }, 2000);

    return () => {
      clearTimeout(fakeAsyncTask);
      logoScale.setValue(0);
    }; // Cleanup the timeout and reset animation on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#50BDD2" barStyle="light-content" />
      <View style={styles.backgroundContainer}>
        <View style={styles.logoContainer}>
          <Animated.Text
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}>
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
