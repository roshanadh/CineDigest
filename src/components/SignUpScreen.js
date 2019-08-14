import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	TextInput,
	Text,
	StyleSheet,
	Alert,
} from 'react-native';

import TextIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeyIcon from 'react-native-vector-icons/Feather';
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'Reactoffline.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Offline Database';
const database_size = 200000;

export default class SignUpScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
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
				Alert.alert('Error', 'Please fill up your name!', [{
					text: 'okay',
				}]);
			} else if (username === '') {
				Alert.alert('Error', 'Please fill up your username!', [{
					text: 'okay',
				}]);
			} else if (password1 === '') {
				// If password not entered
				Alert.alert('Error', 'Please enter your password!', [{
					text: 'okay',
				}]);
			} else if (password2 === '') {
				Alert.alert('Error', 'Please confirm your password!', [{
					text: 'okay',
				}]);
			} else if (password1 !== password2) {
				// If Not same return False
				Alert.alert('Error', 'The passwords did not match!', [{
					text: 'okay',
				}]);
			} else {
				// this.props.navigation.navigate('SignIn');
				this.initDb(this.state.name, this.state.username, this.state.password1);
			}
		};

		this.signUpHandler = () => {
			this.checkSignUp();
		};

		this.initDb = (name, username, password) => {
			let db;
			return new Promise((resolve) => {
				console.warn('Plugin integrity check ...');
				SQLite.echoTest()
					.then(() => {
						console.warn('Integrity check passed ...');
						console.warn('Opening database ...');

						SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: 1})
							.then(DB => {
								db = DB;
								console.warn('Database OPEN');
								db.transaction((tx) => {
									tx.executeSql(`CREATE TABLE "users" (
										"username"	TEXT NOT NULL UNIQUE,
										"password"	TEXT NOT NULL,
										"name"	TEXT NOT NULL,
										PRIMARY KEY("username")
									)`);
								})
									.then(() => console.warn('Table users Created!'))
									.catch((error) => console.warn('Table users was not created! ' + error.message))
									.then(() => {
										db.transaction((tx) => {
											tx.executeSql(`INSERT INTO users VALUES ('${username}', '${password}', '${name}')`);
											Alert.alert(`Successful`, `${username} has been registered!`);
										})
										.catch(error => {
											console.warn('Error in INSERT: ' + error.message);
											Alert.alert(`Oops`, `Username ${username} already exists!`);
										});
									})
									.then(() => {
										db.transaction((tx) => {
											tx.executeSql('SELECT u.name, u.username, u.password FROM users u', [])
												.then(([tx, results]) => {
													console.log('Query completed');
													var len = results.rows.length;
													for (let i = 0; i < len; i++) {
														let row = results.rows.item(i);
														console.warn(
															`Name: ${row.name}, Username: ${row.username},
															Password: ${row.password}`);
													}
												})
												.catch(error => console.warn('Error in SELECT, ' + error.message));
										});
									});
							})
							.catch(error => console.warn('Echo test error: ' + error.message));
					});
			});
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.signInHeader}>Cine Digest</Text>
				<View style={styles.usernameWrapper}>
					<TextInput
						style={styles.input}
						placeholder="Firstname"
						onChangeText={(name) => this.setState({ name })} />
					<TextIcon name="format-text" size={25} color="#ddd" />
				</View>

				<View style={styles.usernameWrapper}>
					<TextInput
						style={styles.input}
						placeholder="Username"
						onChangeText={(username) => this.setState({ username })} />
					<TextIcon name="format-text" size={25} color="#ddd" />
				</View>

				<View style={styles.passwordWrapper}>
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry={true}
						onChangeText={(password1) => this.setState({ password1 })} />

					<KeyIcon name="key" size={25} color="#ddd" />
				</View>

				<View style={styles.passwordWrapper}>
					<TextInput
						style={styles.input}
						placeholder="Confirm Password"
						secureTextEntry={true}
						onChangeText={(password2) => this.setState({ password2 })} />

					<KeyIcon name="key" size={25} color="#ddd" />
				</View>

				<TouchableOpacity style={styles.signupBtn}
					onPress={this.signUpHandler}>
					<Text style={styles.btnText}>Sign-up</Text>
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
		fontSize: 25,
		alignSelf: 'center',
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
		marginBottom: 15,
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
		marginBottom: 15,
	},
	input: {
		marginRight: 10,
		flex: 5,
		minHeight: '6%',
	},
	signupBtn: {
		marginTop: 5,
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 50,
		padding: 15,
		width: '35%',
		backgroundColor: '#22a7f0',
	},
	btnText: {
		color: 'white',
	},
});
