import React from 'react';
import {
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native';

const App = () => {
	return (
		<StatusBar barStyle="dark-content" />
	);
};

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: '#000000',
	}
});
export default App;
