import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
} from 'react-native';
import {onSignOut} from '../auth/auth';

export default class SettingsScreen extends Component {
    render() {
        return (
            <View style={{paddingVertical: 20}}>
                <Button
                    title="Sign out"
                    onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}
                />
            </View>
        );
    }
}
