import React, {Component} from 'react';
import { 
	Text,
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

export default class ShowsScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			searchQuery: '',
			searchResponse: {

			},
		};
	}

    searchFieldChangedHandler = (newQuery) => {
		this.setState({
			searchQuery: newQuery,
		});
	};

	searchBtnPressedHandler = () => {
		alert(this.state.searchQuery);
	};

    render() {
		return (
			<View style={styles.container}>
				<View style={styles.searchWrapper}>
					<TextInput placeholder="Search a TV show"
						style={styles.searchTextInput}
						onChangeText={this.searchFieldChangedHandler} />

					<TouchableOpacity style={styles.searchBtn}
						onPress={this.searchBtnPressedHandler}>
						<Text>Search</Text>
					</TouchableOpacity>
				</View>
				<Text>{this.state.searchQuery}</Text>
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
	searchWrapper: {
		margin: 10,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	searchTextInput: {
		marginRight: 5,
		borderColor: '#010101',
		borderRadius: 5,
		borderWidth: 1,
		paddingLeft: 20,
		paddingRight: 20,
		width: '78%',
	},
	searchBtn: {
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 5,
		padding: 15,
		minHeight: '6%',
		width: '18%',
	},
});

