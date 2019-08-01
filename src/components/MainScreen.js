import {Text, View, StyleSheet} from 'react-native';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';

import MoviesScreen from './MoviesScreen.js';
import ShowsScreen from './ShowsScreen.js';

const AppTabNavigator = createBottomTabNavigator({
    MoviesScreen,
	ShowsScreen,
});

export default createAppContainer(AppTabNavigator);
