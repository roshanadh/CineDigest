import React from 'react';

import MovieIcon from 'react-native-vector-icons/FontAwesome';
import TVIcon from 'react-native-vector-icons/FontAwesome';
import SettingsIcon from 'react-native-vector-icons/SimpleLineIcons';

import {
    createBottomTabNavigator,
    createAppContainer,
} from 'react-navigation';

import MoviesListsScreen from './MoviesListsScreen';
import ShowsListsScreen from './ShowsListsScreen';
import SettingsScreen from './SettingsScreen';

const AppTabNavigator = createBottomTabNavigator(
    {
        MoviesListsScreen: {
            screen: MoviesListsScreen,
            navigationOptions: {
                tabBarLabel: 'Movies',
                tabBarIcon: ({tintColor}) => (
                    <MovieIcon name="film" size={20} color={tintColor} />
                ),
            },
        },
        ShowsListsScreen: {
            screen: ShowsListsScreen,
            navigationOptions: {
                tabBarLabel: 'Shows',
                tabBarIcon: ({tintColor}) => (
                    <TVIcon name="television" size={20} color={tintColor} />
                ),
            },
        },
        SettingsScreen: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarLabel: 'Settings',
                tabBarIcon: ({tintColor}) => (
                    <SettingsIcon name="settings" size={21} color={tintColor} />
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
                paddingTop: 5,
            },
        },
    },
);

export default createAppContainer(AppTabNavigator);
