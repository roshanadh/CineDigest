import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
} from 'react-native';

export default class SignUpScreen extends Component {
    render() {
        return (
            <View style={{ paddingVertical: 20 }}>
                <Button
                    title="Sign In"
                    onPress={() => this.props.navigation.navigate('SignIn')}
                />
            </View>
        );
    }
}
