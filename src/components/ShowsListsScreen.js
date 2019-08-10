import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
} from 'react-native';
import SearchItem from './SearchItem';

export default class MoviesScreen extends Component {
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
			searchType: 's',
		});
	};

	onIdSelected = (itemId, itemTitle) => {
		this.props.navigation.navigate('ShowDetailsScreen', {
			screenName: itemTitle,
			titleId: itemId,
		});
	};

    render() {
		return (
			<ScrollView style={styles.scrollView}>
				<View style={styles.container}>
					<SearchItem onChangeText={this.searchFieldChangedHandler}
						placeholder="Search a TV show"
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


