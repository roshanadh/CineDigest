import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import {onSignOut} from '../auth/auth';

export default class SettingsScreen extends Component {
    render() {
        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.signOutBtn}
                        onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}>
                        <Text style={styles.btnText}>Sign-out</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    container: {
        padding: 20,
		flex: 1,
		flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOutBtn: {
        marginTop: 20,
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 50,
        padding: 15,
        width: '50%',
		backgroundColor: '#22a7f0',
    },
    btnText: {
		color: '#fff',
	},
});
