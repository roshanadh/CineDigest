import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';
import SearchItem from './SearchItem';
import ListContainer from './ListContainer';
import ShowDetailsScreen from './ShowDetailsScreen';

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
		fetch(`https://api-cine-digest.herokuapp.com/api/v1/searchs/${this.state.searchQuery}`)
			.then(response => response.json())
			.then(jsonResponse => { // TODO read full response, not just titles
				this.setState({
					isEmpty: false,
					searchResponse: jsonResponse,
				});
			}) // TODO fix response status parsing
			.catch(error => {
				alert('Oops!\nPlease make sure your search query is correct!');
				this.state.searchResponse = error.response.status;
			});
	};

	onIdSelected = (itemId, itemTitle) => {
		this.props.navigation.navigate('ShowDetailsScreen', {
			screenName: itemTitle,
			titleId: itemId,
		});
	};

    render() {
		if (!this.state.isEmpty) {
			return (
				<View style={styles.container}>
					<SearchItem onChangeText={this.searchFieldChangedHandler}
						placeholder="Search a TV show"
						onPress={this.searchBtnPressedHandler}
						style={styles.searchItem}
					/>
					<ListContainer
						source={this.state.searchResponse}
						onIdSelected={this.onIdSelected}
					/>
				</View>
			);
		}
		return (
			<View style={styles.container}>
				<SearchItem onChangeText={this.searchFieldChangedHandler}
					placeholder="Search a TV show"
					onSubmitEditing={this.searchBtnPressedHandler} />
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


