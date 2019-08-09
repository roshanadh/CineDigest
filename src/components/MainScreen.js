import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';

import {
    createAppContainer,
    createStackNavigator,
} from 'react-navigation';

import MovieDetailsScreen from './MovieDetailsScreen';
import ShowDetailsScreen from './ShowDetailsScreen';
import SeasonDetailsScreen from './SeasonDetailsScreen';
import TabNavigator from './TabNavigator';

const StackNavigator = createAppContainer(new createStackNavigator({
    TabNavigator: {
        screen: TabNavigator,
        navigationOptions: {
            title: 'Cine Digest',
            headerRight: (
                <View>
                <TouchableOpacity onPress={() => alert('This is a button!')} style={{marginRight: 20,}}>
                    <Text>Click!</Text>
                </TouchableOpacity>
                </View>
            ),
        },
    },
    MovieDetailsScreen,
    ShowDetailsScreen,
    SeasonDetailsScreen,
}));

export default StackNavigator;
