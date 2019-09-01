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
	ImageBackground,
	ScrollView,
	Image,
} from 'react-native';

import Snackbar from 'react-native-snackbar';
import UsernameIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeyIcon from 'react-native-vector-icons/Feather';

import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp.js';
import {onSignIn} from '../auth/auth';
import netCon from '../util/NetCon';

const { width, height } = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;
const btnWidth = width <= 360 ? 0.4 * width : 0.3 * width;

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
							if (error === 'PASSWORD-MISMATCH') {
								CustomSnackbar.showSnackBar(`Incorrect password for '${this.state.username}'!`, 'long', '#e74c3c', 'OK');
							} else if (error === 'USERNAME-NOT-FOUND') {
								CustomSnackbar.showSnackBar(`'${this.state.username}' is not a registered user!`, 'long', '#e74c3c', 'OK');
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
				Snackbar.show({
					title: 'Initializing the app...',
					duration: Snackbar.LENGTH_INDEFINITE,
					color: '#fefefe',
					fontSize: 16,
					backgroundColor: '#3fc380',
					action: {
						title: 'Hide',
						color: '#fefefe',
						onPress: () => { },
					},
				});
				fetch('https://api-cine-digest.herokuapp.com/api/v1')
					.then(response => {
						Snackbar.dismiss();
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
		return (
			<ImageBackground blurRadius={1.3}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				<StatusBar barStyle="dark-content"
					translucent={true}
					backgroundColor="rgba(238, 238, 238, 0)"
				/>
				<ScrollView>
					<View style={styles.container}>
						<View style={styles.signInForm}>
							<Image source={require('../assets/mainLogoWText.png')}
								resizeMode="contain" style={styles.logo} />
							<View style={styles.usernameWrapper}>
								<TextInput placeholder="Username"
									style={styles.textInput}
									autoCapitalize="none"
									onChangeText={this.usernameTextChanged}
									returnKeyType="next" />
								<UsernameIcon name="format-text" size={25} color="#ddd" />
							</View>
							<View style={styles.passwordWrapper}>
								<TextInput placeholder="Password"
									secureTextEntry={true}
									style={styles.textInput}
									autoCapitalize="none"
									onChangeText={this.passwordTextChanged}
									returnKeyType="done"
									onSubmitEditing={this.signInBtnPressedHandler} />
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
				</ScrollView>
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
	metaContainer: {
		flexGrow: 1,
		justifyContent: 'space-between',
		flexDirection: 'column',
	},
	container: {
		padding: 20,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
	logo: {
		width: 300,
		height: 300,
		flex: 1,
		alignSelf: 'center',
	},
	signInForm: {
		flex: 5,
		justifyContent: 'flex-end',
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
		margin: 30,
	},
	signUpText: {
		textAlign: 'center',
		color: '#19b5fe',
	},
});

export default SignInScreen;
