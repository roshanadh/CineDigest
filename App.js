import React, {Component} from 'react';
import {
	createAppContainer,
	createStackNavigator,
} from 'react-navigation';

import MainScreen from './src/components/MainScreen';
import SignInScreen from './src/components/SignInScreen';
import ShowsScreen from './src/components/ShowsScreen';
import MovieDetailsScreen from './src/components/MovieDetailsScreen';
import MoviesListsScreen from './src/components/MoviesListsScreen';

const AppNavigator = createStackNavigator(
	{
		Home: SignInScreen,
		MainScreen,
		MoviesListsScreen,
		ShowsScreen,
		MovieDetailsScreen,
	},
	{
		initialRouteName: 'Home',
	},
);

class App extends Component {
	render() {
		return (
			<AppContainer />
		);
	}
}

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
