import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	TextInput,
	Text,
	StyleSheet,
	Alert,
	ActivityIndicator,
	ImageBackground,
	ScrollView,
	Image,
	StatusBar,
	Dimensions,
	ProgressBarAndroid,
} from 'react-native';

import bcrypt from 'react-native-bcrypt';

import TextIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp.js';
import netCon from '../util/NetCon.js';

const { width, height } = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;
const btnWidth = width <= 360 ? 0.4 * width : 0.3 * width;

export default class SignUpScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: false,
			name: '',
			email: '',
			username: '',
			password1: '',
			password2: '',
			passwordProgress: 0,
		};

		this.updatePassword = (password1) => {
			if (this.state.password1 < password1) {
				// Password length increased
				if (password1.length >= 8) {
					this.setState({ password1, passwordProgress: 1 });
				} else {
					this.setState({ password1, passwordProgress: this.state.passwordProgress + (1 / 8) });
				}
			} else {
				// Password length decreased
				if (password1.length === 0) {
					this.setState({ password1, passwordProgress: 0 });
				} else if (password1.length >= 8) {
					this.setState({ password1, passwordProgress: 1 });
				} else {
					this.setState({ password1, passwordProgress: this.state.passwordProgress - (1 / 8) });
				}
			}
		};

		this.genProgressBarJsx = () => {
			if (this.state.password1.length === 0) {
				return (
					<ProgressBarAndroid
						styleAttr="Horizontal"
						indeterminate={false}
						progress={1}
						style={styles.progressBar}
						color="#22a7f0" />
				);
			} else if (this.state.password1.length > 0 && this.state.password1.length < 6) {
				return (
					<ProgressBarAndroid
						styleAttr="Horizontal"
						indeterminate={false}
						progress={this.state.passwordProgress}
						style={styles.progressBar}
						color="#e74c3c" />
				);
			} else if (this.state.password1.length >= 6 && this.state.password1.length < 8) {
				return (
					<ProgressBarAndroid
						styleAttr="Horizontal"
						indeterminate={false}
						progress={this.state.passwordProgress}
						style={styles.progressBar}
						color="#f4b350" />
				);
			} else {
				return (
					<ProgressBarAndroid
						styleAttr="Horizontal"
						indeterminate={false}
						progress={this.state.passwordProgress}
						style={styles.progressBar}
						color="#22a7f0" />
				);
			}
		};

		this.genPasswordIconJsx = () => {
			if (this.state.password1.length === 0) {
				return (
					<FeatherIcon name="key" size={25} color="#ddd" />
				);
			} else if (this.state.password1.length > 0 && this.state.password1.length < 6) {
				return (
					<FeatherIcon name="key" size={25} color="#e74c3c" />
				);
			} else if (this.state.password1.length >= 6 && this.state.password1.length < 8) {
				return (
					<FeatherIcon name="key" size={25} color="#f4b350" />
				);
			} else {
				return (
					<FeatherIcon name="key" size={25} color="#22a7f0" />
				);
			}
		};

		this.genConfirmPasswordIconJsx = () => {
			if (this.state.password2.length === 0) {
				return (
					<FeatherIcon name="key" size={25} color="#ddd" />
				);
			} else if (this.state.password2.length > 0 && (this.state.password1 !== this.state.password2)) {
				return (
					<FeatherIcon name="key" size={25} color="#e74c3c" />
				);
			} else {
				return (
					<FeatherIcon name="key" size={25} color="#22a7f0" />
				);
			}
		};

		this.genNameIconJsx = () => {
			if (this.state.name.length === 0) {
				return (
					<TextIcon name="format-text" size={25} color="#ddd" />
				);
			} else {
				return (
					<TextIcon name="format-text" size={25} color="#22a7f0" />
				);
			}
		};

		this.genUsernameIconJsx = () => {
			if (this.state.username.length === 0) {
				return (
					<TextIcon name="format-text" size={25} color="#ddd" />
				);
			} else if (this.usernameLengthErrorTextJsx !== null ||
				this.usernameCharErrorTextJsx !== null) {
				return (
					<TextIcon name="format-text" size={25} color="#e74c3c" />
				);
			} else {
				return (
					<TextIcon name="format-text" size={25} color="#22a7f0" />
				);
			}
		};

		this.genEmailIconJsx = () => {
			if (this.state.email.length === 0) {
				return (
					<FeatherIcon name="at-sign" size={25} color="#ddd" />
				);
			} else {
				return (
					<FeatherIcon name="at-sign" size={25} color="#22a7f0" />
				);
			}
		};

		this.checkSignUp = () => {
			netCon.checkNetCon()
				.then(success => {
					// Internet connection is available
					const {
						name,
						username,
						email,
						password1,
						password2,
					} = this.state;

					const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

					if (name === '') {
						this.setState({ isLoading: false });
						Alert.alert('Error', 'Please fill up your name!', [{
							text: 'okay',
						}]);
					} else if (username === '') {
						this.setState({ isLoading: false });
						Alert.alert('Error', 'Please fill up your username!', [{
							text: 'okay',
						}]);
					} else if (email === '') {
						this.setState({ isLoading: false });
						Alert.alert('Error', 'Please fill up your email!', [{
							text: 'okay',
						}]);
					} else if (password1 === '') {
						this.setState({ isLoading: false });
						// If password not entered
						Alert.alert('Error', 'Please enter your password!', [{
							text: 'okay',
						}]);
					} else if (password2 === '') {
						this.setState({ isLoading: false });
						Alert.alert('Error', 'Please confirm your password!', [{
							text: 'okay',
						}]);
					} else if (password1 !== password2) {
						this.setState({ isLoading: false });
						// If Not same return False
						Alert.alert('Error', 'The passwords did not match!', [{
							text: 'okay',
						}]);
					} else if (!email.match(mailFormat)) {
						this.setState({ isLoading: false });
						Alert.alert('Error', 'The email you entered is invalid!', [{
							text: 'okay',
						}]);

					} else if (this.state.username.includes('.') || this.state.username.includes('/') ||
						this.state.username.includes('\\') || this.state.username.includes('|') ||
						this.state.username.includes('~') || this.state.username.includes('`') ||
						this.state.username.includes('!') || this.state.username.includes('@') ||
						this.state.username.includes('+') || this.state.username.includes('-') ||
						this.state.username.includes('*') || this.state.username.includes('=') ||
						this.state.username.includes('#') || this.state.username.includes('$') ||
						this.state.username.includes('%') || this.state.username.includes('^') ||
						this.state.username.includes('&') || this.state.username.includes('(') ||
						this.state.username.includes(')') || this.state.username.includes(';') ||
						this.state.username.includes(':') || this.state.username.includes('{') ||
						this.state.username.includes('}') || this.state.username.includes('[') ||
						this.state.username.includes(']') || this.state.username.includes('\'') ||
						this.state.username.includes('"') || this.state.username.includes('?') ||
						this.state.username.includes('<') || this.state.username.includes('>') ||
						this.state.username.includes(',') || this.state.username.includes(' ') ||
						this.state.username.length < 6 || this.state.password1.length < 6) {

						this.setState({ isLoading: false });
						Alert.alert('Error', 'Some fields may have errors!', [{
							text: 'okay',
						}]);
					} else {
						// Generate Salt for hashing (with 10 rounds) / ASYNC
						bcrypt.genSalt(5, (_err, salt) => {
							// Generate Hash for the password / ASYNC
							bcrypt.hash(this.state.password1, salt, (_err, hash) => {
								console.warn(hash + ' is the hash!');
								let addPromise = db.addUser(this.state.username,this.state.email, hash, this.state.name);
								addPromise.then(result => {
									this.setState({ isLoading: false });
									console.warn(result);
									Alert.alert(
										'Successful',
										`${result.username} has been registered!`, [{
											text: 'OK',
											onPress: () => props.navigation.navigate('SignIn'),
										}]
									);
								}, err => {
									this.setState({ isLoading: false });
									if (err.status === 'ER_DUP_ENTRY') {
										if (JSON.stringify(err.message).includes('email')) {
											Alert.alert('Oops', `Email ${this.state.email} is used!`);
											console.warn(err.message);
										} else {
											Alert.alert('Oops', `Username ${this.state.username} already exists!`);
											console.warn(err);
										}
									} else {
										Alert.alert('Error', 'Error message: ' + err);
										console.warn(err);
									}
								});
							});
						});
					}
				}, error => {
					// Internet connection is unavailable
					this.setState({ isLoading: false });
					CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
				});
		};

		this.signUpHandler = () => {
			this.setState({isLoading: true});
			this.checkSignUp();
		};
	}

	render() {
		this.usernameLengthErrorTextJsx =
			this.state.username.length > 0 && this.state.username.length < 6 ?
				<Text style={styles.errorText}>Username must contain atleast 6 characters</Text> : null;
		this.usernameCharErrorTextJsx =
			this.state.username.includes('.') || this.state.username.includes('/') ||
				this.state.username.includes('\\') || this.state.username.includes('|') ||
				this.state.username.includes('~') || this.state.username.includes('`') ||
				this.state.username.includes('!') || this.state.username.includes('@') ||
				this.state.username.includes('+') || this.state.username.includes('-') ||
				this.state.username.includes('*') || this.state.username.includes('=') ||
				this.state.username.includes('#') || this.state.username.includes('$') ||
				this.state.username.includes('%') || this.state.username.includes('^') ||
				this.state.username.includes('&') || this.state.username.includes('(') ||
				this.state.username.includes(')') || this.state.username.includes(';') ||
				this.state.username.includes(':') || this.state.username.includes('{') ||
				this.state.username.includes('}') || this.state.username.includes('[') ||
				this.state.username.includes(']') || this.state.username.includes('\'') ||
				this.state.username.includes('"') || this.state.username.includes('?') ||
				this.state.username.includes('<') || this.state.username.includes('>') ||
				this.state.username.includes(',') || this.state.username.includes(' ') ?
				<Text style={styles.errorText}>Username must not contain any special characters</Text> : null;

		this.passwordLengthErrorTextJsx =
			this.state.password1.length > 0 && this.state.password1.length < 6 ?
				<Text style={styles.errorText}>Password must contain atleast 6 characters</Text> : null;
		this.confirmPasswordErrorTextJsx =
			this.state.password2.length > 0 && (this.state.password1 !== this.state.password2) ?
				<Text style={styles.errorText}>Passwords do not match</Text> : null;

		this.noErrorTextJsx = this.usernameCharErrorTextJsx === null && this.usernameLengthErrorTextJsx === null
			&& this.passwordLengthErrorTextJsx === null && this.confirmPasswordErrorTextJsx === null ?
			<Text style={styles.footerText}>
				By signing up, you can begin making watch-lists for your favourite
				movies and television titles, and also be on a look-out for more.
			</Text>
			: null;

		let indicatorJsx = this.state.isLoading ?
			<ActivityIndicator size="small" color="#fefefe"
				style={styles.indicator} /> : null;
		let nameIconJsx = this.genNameIconJsx();
		let usernameIconJsx = this.genUsernameIconJsx();
		let emailIconJsx = this.genEmailIconJsx();
		let progressBarJsx = this.genProgressBarJsx();
		let passwordIconJsx = this.genPasswordIconJsx();
		let confirmPasswordIconJsx = this.genConfirmPasswordIconJsx();

		return (
			<ImageBackground blurRadius={1.3} source={require('../assets/lilypads.png')} resizeMode="cover" style={styles.bgImage}>
				<StatusBar barStyle="dark-content"
					translucent={true}
					backgroundColor="rgba(255, 255, 255, 1)"
				/>
				<ScrollView style={styles.metaContainer}>
					<View style={styles.container}>
						<Image source={require('../assets/mainLogoWText.png')}
							resizeMode="contain" style={styles.logo} />
						<View style={styles.metaWrapper}>
							<View style={styles.usernameWrapper}>
								<TextInput
									style={styles.input}
									placeholder="Name"
									onChangeText={(name) => this.setState({ name })}
									returnKeyType="next" />
								{nameIconJsx}
							</View>
						</View>
						<View style={styles.metaWrapper}>
							<View style={
								this.usernameLengthErrorTextJsx !== null ||
									this.usernameCharErrorTextJsx !== null ?
									styles.errorWrapper :
									styles.usernameWrapper}
							>
								<TextInput
									style={styles.input}
									placeholder="Username"
									autoCapitalize="none"
									onChangeText={(username) => this.setState({ username })}
									returnKeyType="next" />
								{usernameIconJsx}
							</View>
						</View>
						<View style={styles.metaWrapper}>
							<View style={styles.emailWrapper}>
								<TextInput
									style={styles.input}
									placeholder="Email"
									autoCapitalize="none"
									autoCompleteType="email"
									keyboardType="email-address"
									onChangeText={(email) => this.setState({ email })}
									returnKeyType="next" />
								{emailIconJsx}
							</View>
						</View>
						<View style={styles.metaWrapper}>
							<View style={styles.noBorderPasswordWrapper}>
								<TextInput
									style={styles.input}
									placeholder="Password"
									autoCapitalize="none"
									secureTextEntry={true}
									onChangeText={password1 => this.updatePassword(password1)}
									returnKeyType="next" />
								{passwordIconJsx}
							</View>
							{progressBarJsx}
						</View>

						<View style={styles.metaWrapper}>
							<View style={
								this.confirmPasswordErrorTextJsx !== null ?
									styles.errorWrapper : styles.passwordWrapper
							}>
								<TextInput
									style={styles.input}
									placeholder="Confirm Password"
									secureTextEntry={true}
									autoCapitalize="none"
									onChangeText={(password2) => this.setState({ password2 })}
									returnKeyType="done"
									onSubmitEditing={this.signUpHandler} />
								{confirmPasswordIconJsx}
							</View>
						</View>

						<TouchableOpacity style={styles.signupBtn}
							onPress={this.signUpHandler}>
							<Text style={styles.btnText}>Sign-up</Text>
							{indicatorJsx}
						</TouchableOpacity>
						<View style={styles.footer}>
							{this.usernameLengthErrorTextJsx}
							{this.usernameCharErrorTextJsx}
							{this.passwordLengthErrorTextJsx}
							{this.confirmPasswordErrorTextJsx}
							{this.noErrorTextJsx}
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
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 25,
	},
	logo: {
		width: 300,
		height: 150,
		flex: 1,
		marginBottom: 20,
		alignSelf: 'center',
	},
	metaWrapper: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		marginBottom: 25,
		width: '100%',
	},
	usernameWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#22a7f0',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	emailWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#22a7f0',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	progressBar: {
		width: '100%',
		height: 1,
	},
	horizontalRule: {
		borderBottomWidth: 1,
		width: '100%',
		borderColor: '#22a7f0',
	},
	errorWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#e74c3c',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	errorText: {
		color: '#e74c3c',
		fontSize: 14,
		alignSelf: 'center',
		textAlign: 'center',
		marginBottom: 10,
	},
	passwordWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#22a7f0',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	noBorderPasswordWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	passwordErrorWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.2,
		borderColor: 'red',
		borderRadius: 5,
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 40,
	},
	input: {
		marginRight: 10,
		flex: 5,
		minHeight: '6%',
	},
	signupBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 50,
		marginTop: 20,
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
	footer: {
		marginTop: 30,
	},
	footerText: {
		marginBottom: 5,
		textAlign: 'center',
		color: '#336e7b',
	},
});
