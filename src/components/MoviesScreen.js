import React, {Component} from 'react';
import {
	View,
	StyleSheet,
} from 'react-native';
import SearchItem from './SearchItem';
import ListContainer from './ListContainer';

export default class MoviesScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			searchQuery: '',
			searchResponse: {},
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
					searchResponse: jsonResponse,
				});
			}) // TODO fix response status parsing
			.catch(error => {
				alert("Oops!\nPlease make sure your search query is correct!");
				this.state.searchResponse = error.response.status;
			});
	};

    render() {
		if (!this.state.isEmpty) {
			return (
				<View style={styles.container}>
					<SearchItem onChangeText={this.searchFieldChangedHandler}
						onPress={this.searchBtnPressedHandler}
						style={styles.searchItem}
					/>

					<ListContainer
						source={this.state.searchResponse.titles}
					/>
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<SearchItem onChangeText={this.searchFieldChangedHandler}
					onPress={this.searchBtnPressedHandler} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
});

