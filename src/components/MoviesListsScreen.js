import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	ImageBackground,
} from 'react-native';
import SearchItem from './SearchItem';
import AsyncStorage from '@react-native-community/async-storage';
import db from '../db/db';

export default class MoviesListsScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			username: '',
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
			username: this.state.username,
		});
	};

	getUsername = async() => {
		let username = await AsyncStorage.getItem('USER_KEY');
		this.setState({username});
	}

	componentDidMount() {
		this.getUsername();
	}

    render() {
		db.getHistory(this.state.username)
		.then(result => {
			// alert(result[0].titleId);
			let len = result.length;
			console.warn('Result len: ' + len);
			for (let i = 0; i < len; i++) {
				console.warn(result[i].titleName);
				console.warn(result[i].titleId);
				console.warn(result[i].titleOverview);
				console.warn(result[i].titleVoteCount);
				console.warn(result[i].titleVoteAverage);
				console.warn(result[i].titlePosterPath);
			}
		}, error => alert(error));
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

