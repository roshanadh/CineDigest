import {
    createSwitchNavigator,
    createAppContainer,
    createStackNavigator,
} from 'react-navigation';

import MainScreen from './MainScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

export const SignedOut = createAppContainer(new createStackNavigator({
    SignIn: {
        screen: SignInScreen,
        navigationOptions: {
            title: 'Sign In',
        },
    },
    SignUp: {
        screen: SignUpScreen,
        navigationOptions: {
            title: 'Sign Up',
        },
    },
}));

export const SignedIn = MainScreen;

export const createRootNavigator = (signedIn = false) => {
    return createAppContainer(new createSwitchNavigator(
        {
            SignedIn: {
                screen: SignedIn,
            },
            SignedOut: {
                screen: SignedOut,
            },
        },
        {
            initialRouteName: signedIn ? 'SignedIn' : 'SignedOut',
        }
    ));
};
