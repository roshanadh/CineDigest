import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	TextInput,
	Text,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from 'react-native';

import TextIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeyIcon from 'react-native-vector-icons/Feather';

import db from '../db/db.js';

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
			} else {
				let addPromise = db.addUser(this.state.username, this.state.password1, this.state.name);
				addPromise.then(result => {
					this.setState({isLoading: false});
					console.warn(result);
					Alert.alert(
						'Successful',
						`${result.username} has been registered!`, [{
							text: 'OK',
							onPress: () => props.navigation.navigate('SignIn'),
						}]
					);
				}, err => {
					this.setState({isLoading: false});
					Alert.alert('Oops', `Username ${err.username} already exists!`);
					console.warn(err);
				});
			}
		};

		this.signUpHandler = () => {
			this.setState({isLoading: true});
			this.checkSignUp();
		};
	}

	render() {
		let indicatorJsx = this.state.isLoading ?
			<ActivityIndicator size="small" color="#fefefe"
				style={styles.indicator} /> : null;

		let usernameLengthErrorTextJsx =
			this.state.username.length > 0 && this.state.username.length < 6 ?
				<Text style={styles.errorText}>Username must contain atleast 6 characters</Text> : null;
		let usernameCharErrorTextJsx =
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

		let passwordLengthErrorTextJsx =
			this.state.password1.length > 0 && this.state.password1.length < 6 ?
				<Text style={styles.errorText}>Password must contain atleast 6 characters</Text> : null;
		let confirmPasswordErrorTextJsx =
			this.state.password2.length > 0 && (this.state.password1 !== this.state.password2) ?
				<Text style={styles.errorText}>The passwords do not match</Text> : null;

		return (
			<View style={styles.container}>
				<Text style={styles.signInHeader}>Cine Digest</Text>
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
					{usernameLengthErrorTextJsx}
					{usernameCharErrorTextJsx}
					<View style={
						usernameLengthErrorTextJsx !== null ||
						usernameCharErrorTextJsx !== null ?
							styles.errorWrapper :
							styles.usernameWrapper}
					>
						<TextInput
							style={styles.input}
							placeholder="Username"
							onChangeText={(username) => this.setState({ username })} />
						<TextIcon name="format-text" size={25} color="#ddd" />
					</View>
				</View>
				<View style={styles.metaWrapper}>
					{passwordLengthErrorTextJsx}
					<View style={
						passwordLengthErrorTextJsx !== null ?
							styles.errorWrapper : styles.passwordWrapper
					}>
						<TextInput
							style={styles.input}
							placeholder="Password"
							secureTextEntry={true}
							onChangeText={(password1) => this.setState({ password1 })} />

						<KeyIcon name="key" size={25} color="#ddd" />
					</View>
				</View>

				<View style={styles.metaWrapper}>
					{confirmPasswordErrorTextJsx}
					<View style={
						confirmPasswordErrorTextJsx !== null ?
							styles.errorWrapper : styles.passwordWrapper
					}>
						<TextInput
							style={styles.input}
							placeholder="Confirm Password"
							secureTextEntry={true}
							onChangeText={(password2) => this.setState({ password2 })} />

						<KeyIcon name="key" size={25} color="#ddd" />
					</View>
				</View>

				<TouchableOpacity style={styles.signupBtn}
					onPress={this.signUpHandler}>
					<Text style={styles.btnText}>Sign-up</Text>
					{indicatorJsx}
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 25,
	},
	signInHeader: {
		fontSize: 30,
		alignSelf: 'center',
		marginBottom: 50,
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
		borderWidth: 0.2,
		borderColor: '#010101',
		borderRadius: 5,
		paddingLeft: 20,
		paddingRight: 20,
	},
	errorWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.2,
		borderColor: 'red',
		borderRadius: 5,
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 15,
	},
	errorText: {
		color: 'red',
		fontSize: 14,
		alignSelf: 'flex-end',
	},
	passwordWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.2,
		borderColor: '#010101',
		borderRadius: 5,
		paddingLeft: 20,
		paddingRight: 20,
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
		padding: 15,
		width: '35%',
		backgroundColor: '#22a7f0',
		marginTop: 25,
	},
	btnText: {
		color: '#fff',
		fontSize: 15,
	},
	indicator: {
		marginLeft: 20,
	},
});
