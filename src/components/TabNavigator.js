import React from 'react';
import {
    createAppContainer,
    createMaterialTopTabNavigator,
} from 'react-navigation';

import MovieIcon from 'react-native-vector-icons/FontAwesome';
import TVIcon from 'react-native-vector-icons/FontAwesome';
import SettingsIcon from 'react-native-vector-icons/SimpleLineIcons';

import MoviesListsScreen from './MoviesListsScreen';
import ShowsListsScreen from './ShowsListsScreen';
import SettingsScreen from './SettingsScreen';

const TabNavigator = createMaterialTopTabNavigator(
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
            activeTintColor: '#22a7f0',
            inactiveTintColor: '#24252a',
            labelStyle: {
                fontSize: 12,
                marginTop: 3,
                marginBottom: 10,
            },
            indicatorStyle: {
                backgroundColor: '#fff',
            },
            showIcon: true,
            style: {
                backgroundColor: '#fefefe',
                height: 60,
                borderTopColor: 'rgba(171, 183, 183, 0.2)',
                borderTopWidth: 0.8,
            },
        },
        tabBarPosition: 'bottom',
        lazy: true,
    },
);

export default createAppContainer(TabNavigator);
