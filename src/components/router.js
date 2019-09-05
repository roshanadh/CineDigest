import {
    createSwitchNavigator,
    createAppContainer,
    createStackNavigator,
} from 'react-navigation';

import {StatusBar, Platform} from 'react-native';
import MainScreen from './MainScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ValidateEmailScreen from './ValidateEmailScreen';

export const SignedOut = createAppContainer(new createStackNavigator(
    {
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
        ValidateEmail: {
            screen: ValidateEmailScreen,
            navigationOptions: {
                title: 'Validate Email',
            },
        },
    },
    {
        cardStyle: {
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
        },
    },
));

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
