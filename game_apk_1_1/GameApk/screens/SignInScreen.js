import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, TextInput,ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import MidLoad from './MidLoadScreen';
import Reloading from './ReloadingScreen';


const SignInScreen = (props) => {
    //const baseUrl = 'https://chimerical-seahorse-63dfc9.netlify.app/.netlify/functions/api';
    const baseUrl = 'http://192.168.0.103:3000';
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [existNot, setExistNot] = useState('');
    const [isloading, setIsloading] = useState(false);

    const onboardClick = async () => {
        if (netInfo.isConnected === false) return;
        const url = `${baseUrl}/signin`;
        try {
            setIsloading(true);
            const resToken = await axios.post(url, { email, password })
            if (resToken.data.message === 'invalid') {
                setExistNot('* Invalid username or password');
                setIsloading(false);
            }
            else {
                await AsyncStorage.setItem('token', resToken.data.token)
                setIsloading(false);
                props.navigation.replace('Home')
            }

        } catch (err) {
            console.log(err);
        }
    }
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

            <View style={{ backgroundColor: '#EAE4F1', flex: 1 }}>
                <StatusBar backgroundColor="#50BDD2" barStyle="light-content" />
                <View>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTxt}>Welcome Back</Text>
                        <ActivityIndicator animating={isloading} color="#000000" size={18} />
                    </View>
                    <TextInput
                        autoCapitalize='none'
                        label={'Name'}
                        style={styles.container}
                        value={email}
                        onChangeText={(text) => setEmail(text)} />

                    <TextInput
                        autoCapitalize='none'
                        label={'Password'}
                        style={styles.container}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true} />
                    <Text style={styles.hidetxt}>{existNot}</Text>
                    <Button mode="contained" style={styles.btn} onPress={onboardClick}>
                        Onboard
                    </Button>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
                        <Text style={styles.general}>don't have an account ?</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        marginBottom: 1,
        marginTop: 120,
    },
    hidetxt: {
        color: 'red',
        fontSize: 15,
        textAlign: 'center'
    },
    container: {
        margin: 20,
        marginBottom: 5,
        backgroundColor: '#BAE5F3',
    },
    headerTxt: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 20,
        marginRight: 15,
        color: '#000000',
      },
    general: {
        color: '#000000',
        marginLeft: 40,
        marginTop: 15,
    },
    btn: {
        margin: 30,
        marginBottom: 5,
        backgroundColor: '#000000',
    }
})
export default SignInScreen;