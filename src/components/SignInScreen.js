import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	StatusBar,
	TextInput,
	Dimensions,
	ActivityIndicator,
	ScrollView,
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

import Snackbar from 'react-native-snackbar';
import UsernameIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp.js';
import {onSignIn} from '../auth/auth';
import netCon from '../util/NetCon';

const { height } = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;

class SignInScreen extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
			isLoading: false,
            username: '',
            password: '',
		};

		this.signInBtnPressedHandler = () => {
			netCon.checkNetCon()
				.then(success => {
					// Internet connection is available
					if (this.state.username.trim() === '') {
						CustomSnackbar.showSnackBar('Username cannot be blank!', 'long', '#e74c3c', 'OK');
					} else if (this.state.password.trim() === '') {
						CustomSnackbar.showSnackBar('Password cannot be blank!', 'long', '#e74c3c', 'OK');
					} else {
						this.setState({
							isLoading: true,
						});

						let verifyPromise = db.verifyUser(this.state.username, this.state.password);
						verifyPromise.then(result => {
							onSignIn(this.state.username, result.uuid)
								.then(() => props.navigation.navigate('SignedIn'))
								.catch(error => console.warn(error.message));
						}, error => {
							this.setState({ isLoading: false });
							if (error.status === 'PASSWORD-MISMATCH') {
								CustomSnackbar.showSnackBar(`Incorrect password for '${this.state.username}'!`, 'long', '#e74c3c', 'OK');
							} else if (error.status === 'USERNAME-NOT-FOUND') {
								CustomSnackbar.showSnackBar(`'${this.state.username}' is not a registered user!`, 'long', '#e74c3c', 'OK');
							} else if (error.status === 'NOT-VALIDATED') {
								CustomSnackbar.showSnackBar(`'${this.state.username}' has not been validated!`, 'long', '#e74c3c', 'OK');
								this.props.navigation.navigate('ValidateEmail', {
									email: error.email,
									uuid: error.uuid,
									name: this.state.name,
									username: this.state.username,
								});
							} else {
								CustomSnackbar.showSnackBar('Server is currently down for maintenance!', 'always', '#e74c3c', 'OK');
							}
						});
					}
				}, error => {
					// Internet connection is unavailable
						CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
				});
		};

		this.genUsernameIconJsx = () => {
			if (this.state.username.length === 0) {
				return (
					<UsernameIcon name="format-text" size={25} color="#ddd" />
				);
			} else {
				return (
					<UsernameIcon name="format-text" size={25} color="#963694" />
				);
			}
		};

		this.genPasswordIconJsx = () => {
			if (this.state.password.length === 0) {
				return (
					<FeatherIcon name="key" size={25} color="#ddd" />
				);
			} else {
				return (
					<FeatherIcon name="key" size={25} color="#963694" />
				);
			}
		};

		this.forgotPasswordHandler = () => {
			this.props.navigation.navigate('RecoverPassword');
		};
    }
    static navigationOptions = {
        header: null,
	}

    usernameTextChanged = newUsername => {
        this.setState({username: newUsername});
    };

    passwordTextChanged = newPassword => {
        this.setState({password: newPassword});
    };

	redirectToSignUp = () => {
		this.props.navigation.navigate('SignUp');
	}

	componentDidMount() {
		netCon.checkNetCon()
			.then(success => {
				// Internet connection available
				fetch('https://api-cine-digest.herokuapp.com/api/v1')
					.then(response => {
						if (response.status === 503) {
							CustomSnackbar.showSnackBar('Server is currently down for maintenance!', 'always', '#e74c3c', 'OK');
						} else if (response.status !== 200) {
							CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'always', '#e74c3c', 'OK');
						}
					})
					.catch(error => {
						CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'always', '#e74c3c', 'OK');
					});
			}, error => {
				// Internet connection unavailable
				CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
			});
	}

	render() {
		let indicatorJsx = this.state.isLoading ?
			<ActivityIndicator size="small" color="#fefefe"
				style={styles.indicator} /> : null;
		let passwordIconJsx = this.genPasswordIconJsx();
		let usernameIconJsx = this.genUsernameIconJsx();
		return (
			<View style={styles.metaContainer}>
				<StatusBar barStyle="dark-content"
					translucent={true}
					backgroundColor="rgba(238, 238, 238, 0)"
				/>
				<ScrollView>
					<View style={styles.container}>
						<Text style={styles.welcomeText}>Cine Digest</Text>
						<View style={styles.signInForm}>
							<View style={styles.usernameWrapper}>
								<TextInput placeholder="Username"
									style={styles.textInput}
									autoCapitalize="none"
									onChangeText={this.usernameTextChanged}
									returnKeyType="next" />
								{usernameIconJsx}
							</View>
							<View style={styles.passwordWrapper}>
								<TextInput placeholder="Password"
									secureTextEntry={true}
									style={styles.textInput}
									autoCapitalize="none"
									onChangeText={this.passwordTextChanged}
									returnKeyType="done"
									onSubmitEditing={this.signInBtnPressedHandler} />
								{passwordIconJsx}
							</View>
							<View style={styles.forgotPasswordRedirect}>
								<TouchableOpacity onPress={this.forgotPasswordHandler}>
									<Text style={styles.forgotPasswordText}>
										Forgot Password?
									</Text>
								</TouchableOpacity>
							</View>
							<TouchableOpacity style={styles.signInBtn}
								onPress={this.signInBtnPressedHandler}>
								<Text style={styles.btnText}>Sign In</Text>
								{indicatorJsx}
							</TouchableOpacity>
							<View style={styles.signUpRedirect}>
								<TouchableOpacity style={styles.signUpBtn}
									onPress={() => this.redirectToSignUp()}>
									<Text style={styles.signUpText}>
										Sign Up
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	metaContainer: {
		backgroundColor: '#fff',
	},
	welcomeText: {
		fontSize: responsiveFontSize(10),
		fontFamily: 'Quicksand-Light',
		width: '100%',
		marginBottom: 10,
		color: '#963694',
		paddingTop: 0,
		padding: 25,
		textShadowColor: '#aaa',
		textShadowRadius: 8,
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	logo: {
		width: 250,
		height: 250,
		flex: 1,
		alignSelf: 'center',
	},
	signInForm: {
		padding: 20,
	},
	usernameWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#ddd',
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 25,
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
		borderColor: '#ddd',
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 15,
	},
	signInBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 50,
		padding: 15,
		minHeight: btnHeight,
		width: '80%',
		backgroundColor: '#963694',
	},
	btnText: {
		color: '#fff',
		fontSize: 15,
	},
	indicator: {
		marginLeft: 20,
	},
	signUpBtn: {
		marginTop: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		alignSelf: 'center',
		borderRadius: 50,
		padding: 15,
		width: '80%',
		borderWidth: 1,
		borderColor: '#963694',
	},
	forgotPasswordRedirect: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		textAlign: 'center',
		marginBottom: 30,
	},
	forgotPasswordText: {
		textAlign: 'center',
		// textDecorationLine: 'underline',
		color: '#913d88',
	},
	signUpText: {
		textAlign: 'center',
		fontSize: 15,
		color: '#913d88',
	},
});

export default SignInScreen;
