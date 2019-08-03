import React, {Component} from 'react';
import { 
	Text,
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	FlatList,
} from 'react-native';

export default class MoviesScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			searchQuery: '',
			searchReponse: {},
		};
	}

	searchFieldChangedHandler = (newQuery) => {
		this.setState({
			isEmpty: true,
			searchQuery: newQuery,
			searchResponse: {
			},
		});
	};

	searchBtnPressedHandler = () => {
		// alert(this.state.searchQuery);
		fetch(`https://api-cine-digest.herokuapp.com/api/v1/searchm/${this.state.searchQuery}`)
			.then(response => response.json())
			.then(jsonResponse => { // TODO read full response, not just titles
				this.setState({
					isEmpty: false,
					searchResponse: jsonResponse.titles,
				})
			}) // TODO fix response status parsing
			.catch(error => {
				this.state.searchResponse = error.response.status;
			});
	};

    render() {
		if (!this.state.isEmpty) {
			return (
				<View style={styles.container}>
					<View style={styles.searchWrapper}>
						<TextInput placeholder="Search a movie"
							style={styles.searchTextInput}
							onChangeText={this.searchFieldChangedHandler} />

						<TouchableOpacity style={styles.searchBtn}
							onPress={this.searchBtnPressedHandler}>
							<Text>Search</Text>
						</TouchableOpacity>
					</View>

						<FlatList data={this.state.searchResponse}
							renderItem={({item}) => <Text>{item}</Text>}
						/>
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<View style={styles.searchWrapper}>
					<TextInput placeholder="Search a movie"
						style={styles.searchTextInput}
						onChangeText={this.searchFieldChangedHandler} />

					<TouchableOpacity style={styles.searchBtn}
						onPress={this.searchBtnPressedHandler}>
						<Text>Search</Text>
					</TouchableOpacity>
				</View>
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

