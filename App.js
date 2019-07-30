import React, {Component} from 'react';
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	TextInput,
} from 'react-native';

class App extends Component {

	state = {
		emailId: 'this is email',
		password: 'this is password',
	};
	render() {
		return (
			<View>
				<StatusBar barStyle="default" />
				<View>
					<TextInput value={this.state.emailId} style={styles.textInput} name='emailIdTextInput'/>
					<TextInput value={this.state.password} style={styles.textInput} name='passwordTextInput'/>					
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: '#000000',
	},
	textInput: {
		borderColor: '#000000',
		borderRadius: 5,
	}
});
export default App;
