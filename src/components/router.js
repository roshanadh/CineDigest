import { createStackNavigator, createAppContainer } from 'react-navigation';

import SignUpScreen from './SignUpScreen';
import SignInScreen from './SignInScreen';

const SignedOut = createStackNavigator({
    SignUpScreen: {
        screen: SignUpScreen,
        navigationOptions: {
            title: 'Sign Up',
        },
    },
    SignInScreen: {
        screen: SignInScreen,
        navigationOptions: {
            title: 'Sign In',
        },
    },
});

const AppContainer = createAppContainer(SignedOut);
export default AppContainer;
