import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
} from 'react-native';
import SearchItem from './SearchItem';
import ListContainer from './ListContainer';

export default class MoviesListsScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			searchQuery: '',
		};
	}

	searchFieldChangedHandler = (newQuery) => {
		this.setState({
			searchQuery: newQuery,
		});
	};

	searchBtnPressedHandler = () => {
		this.props.navigation.navigate('SearchScreen', {
			searchQuery: this.state.searchQuery,
			searchType: 'm',
		});
	};

    render() {
		return (
			<ScrollView style={styles.scrollView}>
				<View style={styles.container}>
					<SearchItem onChangeText={this.searchFieldChangedHandler}
						placeholder="Search a movie"
						onSubmitEditing={this.searchBtnPressedHandler} />
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: '#f2f1ef',
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
});

