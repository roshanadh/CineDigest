import React, {Component} from 'react';
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Button,
	TouchableOpacity,
	StatusBar,
	TextInput,
} from 'react-native';

class App extends Component {

	state = {
		emailId: 'this is email',
		password: 'this is password',
	};

	// emailTextChangedHandler = (newEmail) => {
	// 	emailId: newEmail
	// };

	// passwordTextChangedHandler = (newPassword) => {

	// };

	render() {
		return (
			<View style={styles.container}>
					<StatusBar barStyle="default" />
					<View style={styles.signInForm}>
						<Text style={styles.signInHeader}>Sign-in</Text>
						<TextInput placeholder={this.state.emailId}
							style={styles.textInput} name="emailIdTextInput"
							onChange={this.emailTextChanged} />
						<TextInput placeholder={this.state.password}
							secureTextEntry={true}
							style={styles.textInput} name="passwordTextInput"
							onChange={this.passwordTextChanged} />
						<TouchableOpacity style={styles.signInBtn}>
							<Text style={styles.btnText}>Sign-in</Text>
						</TouchableOpacity>
					</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
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
	},
	signInBtn: {
		marginTop: 20,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderWidth: 1,
		borderRadius: 5,
		padding: 15,
		width: '30%',
	},
	btnText: {
	},
});
export default App;
