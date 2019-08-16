import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	TextInput,
	Alert,
	Dimensions,
	ActivityIndicator,
	ImageBackground,
	Image,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';

import UsernameIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeyIcon from 'react-native-vector-icons/Feather';

import db from '../db/db';
import {onSignIn} from '../auth/auth';

const {width, height, fontScale} = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;
const btnWidth = width <= 360 ? 0.4 * width : 0.3 * width;
const headerFontSize = 35 / fontScale;

class SignInScreen extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
			isLoading: false,
            username: '',
            password: '',
		};

		this.signInBtnPressedHandler = () => {
			if (this.state.username.trim() === '') {
				Alert.alert('Sign-in Error', 'Username cannot be blank!');
			} else if (this.state.password.trim() === '') {
				Alert.alert('Sign-in Error', 'Password cannot be blank!');
			} else {
				this.setState({
					isLoading: true,
				});

				let verifyPromise = db.verifyUser(this.state.username, this.state.password);
				verifyPromise.then(result => {
					onSignIn(this.state.username).then(() => props.navigation.navigate('SignedIn'));
				}, error => {
						this.setState({isLoading: false});
						error.status === 'password mismatch' ?
							Alert.alert('Password Error', `Incorrect password for '${error.username}'!`) :
							Alert.alert('Username Error', `'${error.username}' is not a registered user!`);
				});
			}
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

    usernameTextChanged = newUsername => {
        this.setState({username: newUsername});
    };

    passwordTextChanged = newPassword => {
        this.setState({password: newPassword});
    };

	redirectToSignUp = () => {
		this.props.navigation.navigate('SignUp');
	}

	render() {
		this.checkNetConn();
		let indicatorJsx = this.state.isLoading ?
			<ActivityIndicator size="small" color="#fefefe"
				style={styles.indicator} /> : null;
		return (
			<ImageBackground blurRadius={1.3}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>

				<View style={styles.container}>
					<StatusBar barStyle="default" />
					<View style={styles.signInForm}>
						<Image source={require('../assets/mainLogoWText.png')}
							resizeMode="contain" style={styles.logo} />
						<View style={styles.usernameWrapper}>
							<TextInput placeholder="Username"
								style={styles.textInput} autoCapitalize="none"
								onChangeText={this.usernameTextChanged} />
							<UsernameIcon name="format-text" size={25} color="#ddd"/>
						</View>
						<View style={styles.passwordWrapper}>
							<TextInput placeholder="Password"
								secureTextEntry={true}
								style={styles.textInput} autoCapitalize="none"
								onChangeText={this.passwordTextChanged} />
								<KeyIcon name="key" size={25} color="#ddd" />
						</View>
						<TouchableOpacity style={styles.signInBtn}
							onPress={this.signInBtnPressedHandler}>
							<Text style={styles.btnText}>Sign-in</Text>
							{indicatorJsx}
						</TouchableOpacity>
					</View>
					<View style={styles.signUpRedirect}>
						<TouchableOpacity onPress={() => this.redirectToSignUp()}>
							<Text style={styles.signUpText}>
								Sign-up if you don't have an account
							</Text>
						</TouchableOpacity>
					</View>
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
	},
	logo: {
		width: 300,
		height: 60,
		flex: 1,
		alignSelf: 'center',
	},
	signInForm: {
		flex: 5,
		justifyContent: 'flex-end',
	},
	scrollView: {
		backgroundColor: '#fefefe',
	},
	usernameWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#22a7f0',
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 25,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	textInput: {
		marginRight: 10,
		flex: 5,
		minHeight: '6%',
		opacity: 1,
	},
	passwordWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#22a7f0',
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 40,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	signInBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 50,
		padding: 15,
		minHeight: btnHeight,
		width: btnWidth,
		backgroundColor: '#22a7f0',
	},
	btnText: {
		color: '#fff',
		fontSize: 15,
	},
	indicator: {
		marginLeft: 20,
	},
	signUpRedirect: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
	},
	signUpText: {
		textAlign: 'center',
		color: '#19b5fe',
	},
});

export default SignInScreen;
