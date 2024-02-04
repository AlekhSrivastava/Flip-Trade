import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MidLoad from './MidLoadScreen';
import Reloading from './ReloadingScreen';
import { useNetInfo } from '@react-native-community/netinfo';


const UserScreen = (props) => {
    //const baseUrl = 'https://chimerical-seahorse-63dfc9.netlify.app/.netlify/functions/api';
    const baseUrl = 'http://192.168.0.103:3000';
    
    const [email, setEmail] = useState('');
    const [balance, setBalance] = useState(0);
    const [loan, setLoan] = useState(0);
    const [alert, setAlert] = useState('');

    const creditPress = async () => {
        if (netInfo.isConnected === false) return;
        try {
            if (balance == 0) {
                const urlUpdate = `${baseUrl}/upDateCredit`;
                await axios.patch(urlUpdate, {
                    email: email,
                    balance: 100,
                    loan: 100
                });
                setBalance(100);
                setLoan(pre => pre + 100);
            }
            else {
                setAlert('Only when low on balance');
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    const fetchUserData = async () => {
        if (netInfo.isConnected === false) return;
        try {
            const istoken = await AsyncStorage.getItem('token');
            const url = `${baseUrl}/getUser`;
            if (istoken) {
                const { data } = await axios.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + istoken
                    }
                });
                setEmail(data.email);
                setBalance(data.balance);
                setLoan(data.loan);
            }
        } catch (error) {
            console.error('Error fetching user data: ', error);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            props.navigation.replace('Signin');
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

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
        fetchUserData();
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#50BDD2" barStyle="light-content" />
                <View style={styles.ExButton}>
                    <Button mode="contained" style={styles.Exbtn} onPress={() => props.navigation.navigate('Home')}>
                        Exit
                    </Button>
                </View>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>{email}'s Credentials</Title>
                        <Divider style={styles.divider} />
                        <View style={styles.userData}>
                            <View style={styles.row}>
                                <Paragraph style={styles.label}>Name </Paragraph>
                                <Paragraph style={[styles.value, styles.bold]}>{email}</Paragraph>
                            </View>
                            <View style={styles.row}>
                                <Paragraph style={styles.label}>Coins </Paragraph>
                                <Paragraph style={[styles.value, styles.bold]}>{balance}</Paragraph>
                            </View>
                            <View style={styles.row}>
                                <Paragraph style={styles.label}>Borrow </Paragraph>
                                <Paragraph style={[styles.value, styles.bold]}>{loan}</Paragraph>
                            </View>
                        </View>
                        <Divider style={styles.divider} />
                        <Text style={styles.alert}>{alert}</Text>
                        <Button mode='contained' style={styles.credit} onPress={creditPress}>Credit</Button>
                    </Card.Content>
                </Card>

                <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>Logout</Button>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    alert: {
        textAlign: 'center',
        color: 'red',
    },
    credit: {
        marginTop: 20,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'flex-end',
        backgroundColor: '#23B7D1',
    },
    Exbtn: {
        backgroundColor: '#23B7D1'
    },
    ExButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 16,
        paddingTop: 16,
        position: 'absolute',
        top: 10,
        right: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BAE5F3',
        padding: 20,
    },
    card: {
        width: '100%',
        padding: 20,
        backgroundColor: '#98DBEC',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    divider: {
        marginBottom: 10,
        height: 0.8,
        backgroundColor: '#FFFFFF',
    },
    userData: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 80,
        padding: 2,
        paddingHorizontal: 30,
        backgroundColor: '#23B7D1'
    },
});

export default UserScreen;
