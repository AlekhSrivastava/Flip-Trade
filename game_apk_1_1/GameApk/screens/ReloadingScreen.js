import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reloading = (props) => {
  const netInfo = useNetInfo();

  const reload = async() => {
    if (netInfo.isConnected) {
      try {
        const isToken = await AsyncStorage.getItem('token');
        if(isToken) props.navigation.replace('Home')
        else props.navigation.replace('Signup')
      } catch (e) {
        console.log(e);
      }
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Please check your network !</Text>
        <Button mode='contained' style={styles.btn} onPress={reload}>Reload</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color:'black'
  },
  btn: {
    margin: 10,
    padding: 3,
    borderRadius: 10,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Reloading;
