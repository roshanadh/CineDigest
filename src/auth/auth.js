import AsyncStorage from '@react-native-community/async-storage';

export const USER_KEY = 'auth-demo-key'; // Store this key in AsyncStorage

export const onSignIn = (username, uuid) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.multiSet([['USER_KEY', username], ['UUID', uuid]], () => resolve(true));
    });
};

export const onSignOut = () => AsyncStorage.removeItem('USER_KEY');

export const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        // return true after successfully retrieving key
        // or returns false
        // if error, sends back a rejection
        AsyncStorage.getItem('USER_KEY')
            .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => reject(err));
    });
};
