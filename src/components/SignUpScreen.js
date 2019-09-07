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

const { height } = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;

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
			// After initial signup, obtain UUID
			uuid: '',
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
						color="#ddd" />
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
						color="#ddd" />
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
					<FeatherIcon name="key" size={25} color="#963694" />
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
					<FeatherIcon name="key" size={25} color="#963694" />
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
					<TextIcon name="format-text" size={25} color="#963694" />
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
					<TextIcon name="format-text" size={25} color="#963694" />
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
					<FeatherIcon name="at-sign" size={25} color="#963694" />
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
						CustomSnackbar.showSnackBar('You haven\'t entered your name!', 'long', '#e74c3c', 'OK');
					} else if (username === '') {
						this.setState({ isLoading: false });
						CustomSnackbar.showSnackBar('You haven\'t entered your username!', 'long', '#e74c3c', 'OK');
					} else if (email === '') {
						this.setState({ isLoading: false });
						CustomSnackbar.showSnackBar('You haven\'t entered your email!', 'long', '#e74c3c', 'OK');
					} else if (password1 === '') {
						this.setState({ isLoading: false });
						// If password not entered
						CustomSnackbar.showSnackBar('You haven\'t entered your password!', 'long', '#e74c3c', 'OK');
					} else if (password2 === '') {
						this.setState({ isLoading: false });
						CustomSnackbar.showSnackBar('You haven\'t confirmed your password!', 'long', '#e74c3c', 'OK');
					} else if (password1 !== password2) {
						this.setState({ isLoading: false });
						// If Not same return False
						CustomSnackbar.showSnackBar('The passwords didn\'t match!', 'long', '#e74c3c', 'OK');
					} else if (!email.match(mailFormat)) {
						this.setState({ isLoading: false });
						CustomSnackbar.showSnackBar('You entered an invalid email!', 'long', '#e74c3c', 'OK');

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
						CustomSnackbar.showSnackBar('Some fields may have errors!', 'long', '#e74c3c', 'OK');
					} else {
						// Check if sign up required or email update required
						console.warn('shouldUpdate: ' + this.props.navigation.getParam('shouldUpdate'));
						if (typeof this.props.navigation.getParam('shouldUpdate') !== 'undefined'
							&& this.props.navigation.getParam('shouldUpdate') === true) {
							console.warn('Should update entered: ' + this.props.navigation.getParam('shouldUpdate'))
							// Email update required
							this.setState({ validatedStatus: false });
                            db.updateProfile(this.state.username, this.state.uuid, null, null, this.state.email)
                                .then(result => {
                                    this.setState({ isLoading: false }, () => {
										console.warn(result);
										CustomSnackbar.showSnackBar('Your email has been updated!', 'long', '#3fc380', null);
										// Navigate to ValidateEmailScreen
										props.navigation.navigate('ValidateEmail', {
											email: this.state.email,
											name: this.state.name,
											username: this.state.username,
										});
                                    });
                                }, error => {
                                        this.setState({ isLoading: false });
                                        console.warn(error.message);
                                        if (error.status === 'ER_DUP_ENTRY') {
                                            CustomSnackbar.showSnackBar('The email is already registered!', 'long', '#e74c3c', 'OK');
                                        } else {
                                            CustomSnackbar.showSnackBar('Some error occurred. Please try again!', 'long', '#e74c3c', 'OK');
                                        }
                                });
						} else {
							// User sign-up required
							// Generate Salt for hashing (with 10 rounds) / ASYNC
							bcrypt.genSalt(5, (_err, salt) => {
								// Generate Hash for the password / ASYNC
								bcrypt.hash(this.state.password1, salt, (_err, hash) => {
									console.warn(hash + ' is the hash!');
									let addPromise = db.addUser(this.state.username, this.state.email, hash, this.state.name);
									addPromise.then(result => {
										this.setState({ isLoading: false, uuid: result.uuid });
										console.warn(result);
										CustomSnackbar.showSnackBar(`${result.username} has been registered!`, 'long', '#3fc380', null);
										// Navigate to ValidateEmaiScreen
										props.navigation.navigate('ValidateEmail', {
											email: this.state.email,
											name: this.state.name,
											username: this.state.username,
										});
									}, err => {
										this.setState({ isLoading: false });
										if (err.status === 'ER_DUP_ENTRY') {
											if (JSON.stringify(err.message).includes('email')) {
												CustomSnackbar.showSnackBar('The email is already in use!', 'long', '#e74c3c', 'OK');												console.warn(err.message);
											} else {
												CustomSnackbar.showSnackBar('The username is already in use!', 'long', '#e74c3c', 'OK');
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
					}
				}, error => {
					// Internet connection is unavailable
					this.setState({ isLoading: false });
					CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
				});
		};

		this.signUpHandler = () => {
			this.setState({isLoading: true});
			// this.checkSignUp();
			this.props.navigation.navigate('ValidateEmail')
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
			<View style={styles.metaContainer}>
				<StatusBar barStyle="dark-content"
					translucent={true}
					backgroundColor="rgba(255, 255, 255, 1)"
				/>
				<ScrollView>
					<View style={styles.container}>
						<Text style={styles.welcomeText}>Cine Digest</Text>
						<View style={styles.metaWrapper}>
							<View style={styles.usernameWrapper}>
								<TextInput
									style={styles.input}
									editable={typeof this.props.navigation.getParam('isFieldEditable') === 'undefined' ? true : false}
									placeholder="Name"
									defaultValue={this.props.navigation.getParam('name')}
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
									editable={typeof this.props.navigation.getParam('isFieldEditable') === 'undefined' ? true : false}
									placeholder="Username"
									defaultValue={this.props.navigation.getParam('username')}
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
									defaultValue={this.props.navigation.getParam('email')}
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
									editable={typeof this.props.navigation.getParam('isFieldEditable') === 'undefined' ? true : false}
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
									editable={typeof this.props.navigation.getParam('isFieldEditable') === 'undefined' ? true : false}
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
							<Text style={styles.btnText}>{this.props.navigation.getParam('signUpBtnText') || 'Sign Up'}</Text>
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
			</View>
		);
	}
}

const styles = StyleSheet.create({
	metaContainer: {
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 25,
	},
	welcomeText: {
		fontSize: 40,
		fontFamily: 'Quicksand-Light',
		width: '100%',
		marginBottom: 30,
		textAlign: 'center',
		color: '#963694',
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
		borderColor: '#ddd',
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	emailWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#ddd',
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
		borderColor: '#ddd',
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
		borderColor: '#ddd',
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
		width: '60%',
		backgroundColor: '#963694',
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
		color: '#6c7a89',
	},
});
