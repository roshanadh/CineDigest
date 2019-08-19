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
} from 'react-native';

import bcrypt from 'react-native-bcrypt';

import TextIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeyIcon from 'react-native-vector-icons/Feather';

import db from '../db/db.js';

const { width, height } = Dimensions.get('window');
const btnHeight = height <= 640 ? 0.07 * height : 0.06 * height;
const btnWidth = width <= 360 ? 0.4 * width : 0.3 * width;

export default class SignUpScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			isLoading: false,
			name: '',
			username: '',
			password1: '',
			password2: '',
		};
		this.checkSignUp = () => {
			const {
				name,
				username,
				password1,
				password2,
			} = this.state;

			if (name === '') {
				this.setState({isLoading: false});
				Alert.alert('Error', 'Please fill up your name!', [{
					text: 'okay',
				}]);
			} else if (username === '') {
				this.setState({isLoading: false});
				Alert.alert('Error', 'Please fill up your username!', [{
					text: 'okay',
				}]);
			} else if (password1 === '') {
				this.setState({isLoading: false});
				// If password not entered
				Alert.alert('Error', 'Please enter your password!', [{
					text: 'okay',
				}]);
			} else if (password2 === '') {
				this.setState({isLoading: false});
				Alert.alert('Error', 'Please confirm your password!', [{
					text: 'okay',
				}]);
			} else if (password1 !== password2) {
				this.setState({isLoading: false});
				// If Not same return False
				Alert.alert('Error', 'The passwords did not match!', [{
					text: 'okay',
				}]);
			}
			else if (this.state.username.includes('.') || this.state.username.includes('/') ||
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

				this.setState({isLoading: false});
				Alert.alert('Error', 'Some fields may have errors!', [{
					text: 'okay',
				}]);
			} else {
				// Generate Salt for hashing (with 10 rounds) / ASYNC
				bcrypt.genSalt(5, (_err, salt) => {
					// Generate Hash for the password / ASYNC
					bcrypt.hash(this.state.password1, salt, (_err, hash) => {
						console.warn(hash + ' is the hash!');
						let addPromise = db.addUser(this.state.username, hash, this.state.name);
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
							Alert.alert('Oops', `Username ${err.username} already exists!`);
							console.warn(err);
						});
					});
				});
			}
		};

		this.signUpHandler = () => {
			this.setState({isLoading: true});
			this.checkSignUp();
		};
		this.usernameLengthErrorTextJsx;
		this.usernameCharErrorTextJsx;
		this.passwordLengthErrorTextJsx;
		this.confirmPasswordErrorTextJsx;
	}

	render() {
		let indicatorJsx = this.state.isLoading ?
			<ActivityIndicator size="small" color="#fefefe"
				style={styles.indicator} /> : null;

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
									onChangeText={(name) => this.setState({ name })} />
								<TextIcon name="format-text" size={25} color="#ddd" />
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
									onChangeText={(username) => this.setState({ username })} />
								<TextIcon name="format-text" size={25} color="#ddd" />
							</View>
						</View>
						<View style={styles.metaWrapper}>
							<View style={
								this.passwordLengthErrorTextJsx !== null ?
									styles.errorWrapper : styles.passwordWrapper
							}>
								<TextInput
									style={styles.input}
									placeholder="Password"
									autoCapitalize="none"
									secureTextEntry={true}
									onChangeText={(password1) => this.setState({ password1 })} />

								<KeyIcon name="key" size={25} color="#ddd" />
							</View>
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
									onChangeText={(password2) => this.setState({ password2 })} />

								<KeyIcon name="key" size={25} color="#ddd" />
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
