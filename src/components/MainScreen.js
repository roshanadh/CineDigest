import React from 'react';
import {
    TouchableOpacity,
    Text,
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
import SearchScreen from './SearchScreen';

const StackNavigator = createAppContainer(new createStackNavigator({
    TabNavigator: {
        screen: TabNavigator,
        navigationOptions: {
            title: 'Cine Digest',
            headerTitleStyle: {
                fontSize: 18,
            },
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
    SearchScreen,
}));

export default StackNavigator;
