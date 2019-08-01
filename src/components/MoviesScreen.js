import React, {Component} from 'react';
import { 
	Text,
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

export default class MoviesScreen extends Component {
    render() {
		return (
			<View style={styles.container}>
				<TextInput placeholder="Search movie"
					style={styles.searchTextInput} />
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
	},
	searchTextInput: {
		borderColor: '#010101',
		borderRadius: 5,
		borderWidth: 1,
		marginBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
	},
	searchBtn: {
		marginTop: 20,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		borderWidth: 1,
		borderRadius: 50,
		padding: 15,
		minHeight: '8%',
		width: '5%',
	},
});

