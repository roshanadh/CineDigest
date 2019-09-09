import {
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
import RecommendationsScreen from './RecommendationsScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import AboutScreen from './AboutScreen';

const StackNavigator = createAppContainer(new createStackNavigator(
    {
        TabNavigator: {
            screen: TabNavigator,
            navigationOptions: {
                header: null,
            },
        },
        MovieDetailsScreen,
        ShowDetailsScreen,
        SeasonDetailsScreen,
        SearchScreen,
        FullListScreen,
        RecommendationsScreen,
        ChangePasswordScreen,
        AboutScreen,
    },
    {
        cardStyle: {
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        },
    },
));

export default StackNavigator;
