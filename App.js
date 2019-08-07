import React, {Component} from 'react';
import {
	createAppContainer,
	createStackNavigator,
} from 'react-navigation';

import MainScreen from './src/components/MainScreen';
import SignInScreen from './src/components/SignInScreen';
import ShowDetailsScreen from './src/components/ShowDetailsScreen';
import MovieDetailsScreen from './src/components/MovieDetailsScreen';
import SeasonDetailsScreen from './src/components/SeasonDetailsScreen';

const AppNavigator = createStackNavigator(
	{
		Home: SignInScreen,
		MainScreen,
		MovieDetailsScreen,
		ShowDetailsScreen,
		SeasonDetailsScreen,
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
