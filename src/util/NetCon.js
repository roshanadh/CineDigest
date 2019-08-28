import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

class NetCon {
    constructor() {
        this.showSnackBar = (message) => {
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
                backgroundColor: '#e74c3c',
            });
        };

        this.checkNetCon = () => {
            return new Promise((resolve, reject) => {
                NetInfo.fetch().then(state => {
                    state.isConnected ? resolve(true) : reject(false);
                });
            });
        };
    }
}

const netCon = new NetCon();
export default netCon;
