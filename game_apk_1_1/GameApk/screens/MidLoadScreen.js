import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';

const MidLoadScreen = (props) => {

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#3498db" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MidLoadScreen;