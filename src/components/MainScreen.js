import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

export default class MainScreen extends Component {
	render() {
        const { navigation } = this.props;
        const emailId = navigation.getParam('emailId', 'defaultEmail');
		return (
            <View style={styles.container}>
                <Text style={styles.welcomeHeader}>Welcome, {emailId}!</Text>
            </View>
        );
	}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 50,
    },
	welcomeHeader: {
		fontSize: 35,
    },
});
