import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

export default class SignUpScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.signUpBtn}
                    onPress={() => this.props.navigation.navigate('SignIn')}>
                    <Text style={styles.btnText}>Sign-up</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
		flex: 1,
		flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpBtn: {
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
