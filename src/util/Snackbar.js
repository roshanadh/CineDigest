import Snackbar from 'react-native-snackbar';

class CustomSnackbar {
    constructor() {
        this.showSnackBar = (message, length, bgColor, actionTitle) => {
            if (length === 'short') {
                Snackbar.show({
                    title: message,
                    duration: Snackbar.LENGTH_SHORT,
                    action: {
                        title: actionTitle,
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
                        title: actionTitle,
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
                        title: actionTitle,
                        color: '#fefefe',
                        onPress: () => { },
                    },
                    color: '#fefefe',
                    fontSize: 16,
                    backgroundColor: bgColor,
                });
            }
        };

        this.dismiss = () => {
            Snackbar.dismiss();
        };
    }
}

const snackbar = new CustomSnackbar();
export default snackbar;
