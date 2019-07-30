import React, {Component} from 'react';
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native';

class App extends Component {
	render() {
		return (
			<StatusBar barStyle="default" />
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: '#000000',
	}
});
export default App;
