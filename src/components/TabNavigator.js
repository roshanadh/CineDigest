import React from 'react';
import {
    createAppContainer,
    createMaterialTopTabNavigator,
} from 'react-navigation';

import MovieIcon from 'react-native-vector-icons/FontAwesome';
import TVIcon from 'react-native-vector-icons/FontAwesome';
import MoreIcon from 'react-native-vector-icons/MaterialIcons';

import MoviesListsScreen from './MoviesListsScreen';
import ShowsListsScreen from './ShowsListsScreen';
import ProfileScreen from './ProfileScreen';

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
        ProfileScreen: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({tintColor}) => (
                    <MoreIcon name="person" size={25} color={tintColor} />
                ),
            },
        },

    },
    {
        // router config, navigationOptions {for whole tabBar},
        // tabBarOptions go here
        tabBarOptions: {
            activeTintColor: '#913d88',
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
            upperCaseLabel: false,
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
