import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	TextInput,
	Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

const {width, height, fontScale} = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;
const btnWidth = width <= 360 ? 0.4 * width : 0.3 * width;
const headerFontSize = 35 / fontScale;

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

	showSnackBar = (message) => {
		Snackbar.show({
			title: message,
			duration: Snackbar.LENGTH_INDEFINITE,
			action: {
				title: 'OK',
				color: 'green',
				onPress: () => {},
			},
			backgroundColor: '#efefef',
		});
	};

	checkNetConn = () => {
		NetInfo.fetch().then(state => {
			if (!state.isConnected) {
				this.showSnackBar('An internet connection is required!');
			}
		});
	};

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
		this.checkNetConn();
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
		fontSize: headerFontSize,
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
		minHeight: btnHeight,
		width: btnWidth,
	},
	btnText: {
	},
});

export default SignInScreen;
