import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Platform,
    StatusBar,
} from 'react-native';

import {
    createAppContainer,
    createStackNavigator,
} from 'react-navigation';

import MovieDetailsScreen from './MovieDetailsScreen';
import ShowDetailsScreen from './ShowDetailsScreen';
import SeasonDetailsScreen from './SeasonDetailsScreen';
import FullListScreen from './FullListScreen';
import TabNavigator from './TabNavigator';
import SearchScreen from './SearchScreen';

const StackNavigator = createAppContainer(new createStackNavigator(
    {
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
        FullListScreen,
    },
    {
        cardStyle: {
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        },
    },
));

export default StackNavigator;
