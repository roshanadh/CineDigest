import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';

import MoviesScreen from './MoviesScreen.js';
import ShowsScreen from './ShowsScreen.js';

const AppTabNavigator = createBottomTabNavigator(
    {
        MoviesScreen: {
            screen: MoviesScreen,
            navigationOptions: {
                tabBarLabel: 'Movies',
                tabBarIcon: ({tintColor}) => (
                    <Icon name="film" size={30} color={tintColor} />
                ),
            },
        },
        ShowsScreen: {
            screen: ShowsScreen,
            navigationOptions: {
                tabBarLabel: 'Shows',
                tabBarIcon: ({tintColor}) => (
                    <Icon name="television" size={30} color={tintColor} />
                ),
            },
        },
    },
    {
        // router config, navigationOptions {for whole tabBar},
        // tabBarOptions go here
        tabBarOptions: {
            activeTintColor: 'red',
            inactiveTintColor: 'grey',
        },
    },
);

export default createAppContainer(AppTabNavigator);
