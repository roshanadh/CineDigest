import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';

import MoviesListsScreen from './MoviesListsScreen';
import ShowsListsScreen from './ShowsListsScreen';

const AppTabNavigator = createBottomTabNavigator(
    {
        MoviesListsScreen: {
            screen: MoviesListsScreen,
            navigationOptions: {
                tabBarLabel: 'Movies',
                tabBarIcon: ({tintColor}) => (
                    <Icon name="film" size={20} color={tintColor} />
                ),
            },
        },
        ShowsListsScreen: {
            screen: ShowsListsScreen,
            navigationOptions: {
                tabBarLabel: 'Shows',
                tabBarIcon: ({tintColor}) => (
                    <Icon name="television" size={20} color={tintColor} />
                ),
            },
        },
    },
    {
        // router config, navigationOptions {for whole tabBar},
        // tabBarOptions go here
        tabBarOptions: {
            activeTintColor: '#cf000f',
            inactiveTintColor: '#24252a',
            labelStyle: {
                fontSize: 14,
                marginBottom: 5,
            },
            style: {
                // backgroundColor: '#e4f1fe',
                height: 60,
                padding: 5,
            },
        },
    },
);

export default createAppContainer(AppTabNavigator);
