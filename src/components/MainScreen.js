import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';

import MoviesScreen from './MoviesScreen.js';
import ShowsScreen from './ShowsScreen.js';

const movieIcon = <Icon name="film" size={30} color="#696969" />;
const showIcon = <Icon name="television" size={30} color="#696969" />;

const AppTabNavigator = createBottomTabNavigator({
    MoviesScreen: {
        screen: MoviesScreen,
        navigationOptions: {
            tabBarLabel: 'Movies',
            tabBarIcon: movieIcon,
        },
    },
	ShowsScreen: {
        screen: ShowsScreen,
        navigationOptions: {
            tabBarLabel: 'Shows',
            tabBarIcon: showIcon,
        },
    },
});

export default createAppContainer(AppTabNavigator);
