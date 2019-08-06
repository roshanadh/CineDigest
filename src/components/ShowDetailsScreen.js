import React, {Component} from 'react';
import {
    Text,
    View,
} from 'react-native';

export default class MovieDetails extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('screenName', 'Show Details'),
        };
    }
    render() {
        return (
            <View>
                <Text>Hello World!</Text>
            </View>
        );
    }
}