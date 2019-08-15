import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	ImageBackground,
} from 'react-native';
import SearchItem from './SearchItem';

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
			<ImageBackground blurRadius={1.3}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				<ScrollView style={styles.scrollView}>
					<View style={styles.container}>
						<SearchItem onChangeText={this.searchFieldChangedHandler}
							placeholder="Search a movie"
							onSubmitEditing={this.searchBtnPressedHandler} />
					</View>
				</ScrollView>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	bgImage: {
		width: '100%',
		height: '100%',
		flex: 1,
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
});

