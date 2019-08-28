import Snackbar from 'react-native-snackbar';

class CustomSnackbar {
    constructor() {
        this.showSnackBar = (message, length, bgColor, actionTitle) => {
            if (length === 'short') {
                Snackbar.show({
                    title: message,
                    duration: Snackbar.LENGTH_SHORT,
                    action: {
                        title: 'OK',
                        color: '#fefefe',
                        onPress: () => { },
                    },
                    color: '#fefefe',
                    fontSize: 16,
                    backgroundColor: bgColor,
                });
            } else if (length === 'long') {
                Snackbar.show({
                    title: message,
                    duration: Snackbar.LENGTH_LONG,
                    action: {
                        title: 'OK',
                        color: '#fefefe',
                        onPress: () => { },
                    },
                    color: '#fefefe',
                    fontSize: 16,
                    backgroundColor: bgColor,
                });
            } else if (length === 'always') {
                Snackbar.show({
                    title: message,
                    duration: Snackbar.LENGTH_INDEFINITE,
                    action: {
                        title: 'OK',
                        color: '#fefefe',
                        onPress: () => { },
                    },
                    color: '#fefefe',
                    fontSize: 16,
                    backgroundColor: bgColor,
                });
            }
        };
    }
}

const snackbar = new CustomSnackbar();
export default snackbar;
