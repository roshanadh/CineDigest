import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default class ChangePassword extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Change Password',
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#6bb9f0',
                elevation: 0,
            },
        };
    }
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <View><Text>Hello World!</Text></View>
        );
    }
}
