import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { TouchableRipple, Text, Button } from 'react-native-paper';
import { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MidLoad from './MidLoadScreen';
import Reloading from './ReloadingScreen';

const HomeScreen = (props) => {

  const urlCards = 'http://192.168.0.103:3000/cardStack';
  const [wholedata, setWholedata] = useState([])
  const fetchCards = async () => {
    if (netInfo.isConnected === false) return;
    const urlUpdate = 'http://192.168.0.103:3000/cardsRem';
    try {
      const newCrd = await axios.post(urlUpdate);
      console.log(newCrd.data.message);
      const { data } = await axios.get(urlCards);
      setWholedata(data);
    }
    catch (err) {
      console.error(err);
    }
  }

  const [prev, setPrev] = useState(100)

  const refresh = async () => {
    if (netInfo.isConnected === false) return;
    const refreshUrl = 'http://192.168.0.103:3000/refreshCard';
    try {
      const { data } = await axios.get(refreshUrl);
      setPrev(data.cardLeft);
    }
    catch (err) {
      console.error(err)
    }
  };
  useEffect(() => fetchCards, [prev]);

  const fetchBalance = async () => {
    if (netInfo.isConnected === false) return;
    try {
      const istoken = await AsyncStorage.getItem('token');
      const urlUser = 'http://192.168.0.103:3000/getUser';
      const { data } = await axios.get(urlUser, {
        headers: {
          'Authorization': 'Bearer ' + istoken
        }
      });
      setEmail(data.email);
      setHaveBalance(data.balance);
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  }
  // herer we can operate the cards and user data

  useEffect(() => {
    fetchCards();
    fetchBalance();
    const interval = setInterval(refresh, 1000); // Fetch data every second
    return () => clearInterval(interval);
  }, []);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [seconds, setSeconds] = useState(5);
  const [haveBalance, setHaveBalance] = useState(0);
  const [email, setEmail] = useState('');

  const handleCardPress = async (item) => {
    if (netInfo.isConnected === false) return;
    if (isButtonDisabled && item.state && haveBalance) {

      setIsButtonDisabled(false);

      const interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds > 1) {
            return prevSeconds - 1;
          } else {
            clearInterval(interval);
            return prevSeconds;
          }
        });
      }, 1000);

      const { _id } = item
      const urlCancle = 'http://192.168.0.103:3000/cardsRem';
      if (item.state == true) {
        try {
          item.state = false;
          const { data } = await axios.post(urlCancle, { _id });

          const urlUpdate = 'http://192.168.0.103:3000/upDateCredit';

          // have to add credit condition
          setHaveBalance(prevBalance => prevBalance - 4 + item.value)

          await axios.patch(urlUpdate, {
            email: email,
            balance: (item.value - 4),
            loan: 0
          });
        }
        catch (err) {
          console.error(err);
        }
      }


      // Enable the button after 5 seconds
      setTimeout(() => {
        setIsButtonDisabled(true);
        setSeconds(5)
      }, 5000);
    }



  };
  const renderGrid = () => {
    let gridItems = [];
    let rowItems = [];

    wholedata.forEach((item, index) => {
      rowItems.push(
        <TouchableRipple
          key={index}
          onPress={() => handleCardPress(item)}
          style={styles.card}>
          {item.state == false ? <Text style={styles.cardtext}>{item.value}</Text> : <Text style={styles.cardtext}></Text>}

        </TouchableRipple>
      );

      if ((index + 1) % 5 === 0) {
        gridItems.push(
          <View key={index} style={styles.row}>
            {rowItems}
          </View>
        );
        rowItems = [];
      }
    });

    return gridItems;
  };
  // have to add interval update

  const netInfo = useNetInfo();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (netInfo.isConnected !== null) {
      setIsConnected(netInfo.isConnected);
    }
  }, [netInfo.isConnected]);

  if (netInfo.isConnected === null) {
    return <MidLoad />
  } else if (!isConnected) {
    return <Reloading />
  } else {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#50BDD2" barStyle="light-content" />
        <View style={styles.topLeft}>
          <Text style={styles.topLeftText}>Coins : {haveBalance}</Text>
          <Text style={styles.topLeftText}>Cards : {prev}</Text>
        </View>
        <Text style={styles.nameText}>Hii, {email}</Text>
        <Button labelStyle={{ fontSize: 15 }} mode='contained' style={styles.cred} onPress={() => props.navigation.replace('User')}>Credentials</Button>
        <View style={styles.container}>
          <View style={styles.circle}>
            {isButtonDisabled ? <Text style={styles.timer}>GO!!</Text> : <Text style={styles.timer}>{seconds}</Text>}
          </View>
          {renderGrid()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  circle: {
    borderWidth: 5,
    borderRadius: 100,
    paddingVertical: 18,
    margin: 20,
    borderColor: '#FFFFFF'
  },
  topLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    borderWidth: 2,
    paddingRight: 70,
    paddingLeft: 15,
    paddingVertical: 2,
    borderRadius: 20,
    borderColor: '#FFFFFF',
    backgroundColor: '#FF5376',
  },
  topLeftText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 1,
  },
  nameText: {
    position: 'absolute',
    top: 70,
    left: 35,
    zIndex: 1,
    fontSize: 23,
    fontWeight: '900',
    color: '#47246A',
  },
  timer: {
    fontSize: 70,
    fontWeight: '900',
    color: '#502080',
    margin: 30,
  },
  cred: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    paddingVertical: 4,
    backgroundColor: '#2B81F3',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 20,
  },
  container: {
    backgroundColor: '#A9E1EF',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    backgroundColor: '#50BDD2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#502080'

  },
  cardtext: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    margin: 10,
  }
});
export default HomeScreen;