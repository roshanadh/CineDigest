import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	TextInput,
} from 'react-native';

class SignInScreen extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            emailId: 'this is email',
            password: 'this is password',
        };
    }
    static navigationOptions = {
        header: null,
    }

    emailTextChanged = newEmail => {
        this.setState({emailId: newEmail});
    };

    passwordTextChanged = newPassword => {
        this.setState({password: newPassword});
    };

	signInBtnPressedHandler = () => {
		this.props.navigation.navigate('MainScreen', {
            emailId: this.state.emailId,
        });
	};
	render() {
		return (
			<View style={styles.container}>
					<StatusBar barStyle="default" />
					<View style={styles.signInForm}>
						<Text style={styles.signInHeader}>Cine Digest</Text>

						<TextInput placeholder="E-mail"
							style={styles.textInput} name="emailIdTextInput"
							onChangeText={this.emailTextChanged} />

						<TextInput placeholder="Password"
							secureTextEntry={true}
							style={styles.textInput} name="passwordTextInput"
							onChangeText={this.passwordTextChanged} />

						<TouchableOpacity style={styles.signInBtn}
							onPress={this.signInBtnPressedHandler}>
							<Text style={styles.btnText}>Sign-in</Text>
						</TouchableOpacity>
					</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 50,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	signInHeader: {
		fontSize: 35,
		alignSelf: 'center',
		marginBottom: 25,
	},
	signInForm: {
	},
	scrollView: {
		backgroundColor: '#000000',
	},
	textInput: {
		borderColor: '#010101',
		borderRadius: 5,
		borderWidth: 1,
		marginBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
	},
	signInBtn: {
		marginTop: 20,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderWidth: 1,
		borderRadius: 50,
		padding: 15,
		minHeight: '6%',
		width: '30%',
	},
	btnText: {
	},
});

export default SignInScreen;
