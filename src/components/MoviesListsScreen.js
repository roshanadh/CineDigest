import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	ImageBackground,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import ListItem from './ListItem';
import SearchItem from './SearchItem';

import db from '../db/db';

export default class MoviesListsScreen extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			username: '',
			searchQuery: '',
			wishList: {
				titleId: '',
				title: '',
				overview: '',
				posterPath: '',
				voteAverage: '',
				voteCount: '',
			},
			wishListJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
		};

		this.getUsername = () => {
			return new Promise((resolve, reject) => {
				let username = AsyncStorage.getItem('USER_KEY');
				resolve(username)
				.catch(error => console.warn('ERROR in getUsername ' + error.message));
			});
		};

		this.initWishList = () => {
			this.getUsername()
			.then(result => {
				this.setState({username: result});
				db.getHistory(result)
					.then(result => {
						let len = result.length;
						console.warn('Result len: ' + len);
						// for (let i = 0; i < len; i++) {
						// 	console.warn(result[i].titleName);
						// 	console.warn(result[i].titleId);
						// 	console.warn(result[i].titleOverview);
						// 	console.warn(result[i].titleVoteCount);
						// 	console.warn(result[i].titleVoteAverage);
						// 	console.warn(result[i].titlePosterPath);
						// }
						this.setState({
							wishList: {
								titleId: result[len - 1].titleId,
								title: result[len - 1].titleName,
								overview: result[len - 1].titleOverview,
								voteCount: result[len - 1].titleVoteCount,
								voteAverage: result[len - 1].titleVoteAverage,
								posterPath: result[len - 1].titlePosterPath,
							},
							wishListJsx:
								<ListItem
									titleId={result[len - 1].titleId}
									title={result[len - 1].titleName}
									overview={result[len - 1].titleOverview}
									voteCount={result[len - 1].titleVoteCount}
									voteAverage={result[len - 1].titleVoteAverage}
									posterPath={result[len - 1].titlePosterPath}
									onItemPressed={() => this.onWishListItemSelected(result[len - 1].titleId, result[len - 1].titleName)}
								/>,
						});
					}, error => console.warn(error));
			}, error => console.warn(error));
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

	componentDidMount() {
		this.initWishList();
	}

	onWishListItemSelected = (itemId, itemTitle) => {
		this.props.navigation.navigate('MovieDetailsScreen', {
				titleId: itemId,
				screenName: itemTitle,
				username: this.state.username,
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
					<View style={styles.wishListHeader}>
						<Text>
							Wish List
							</Text>
						<TouchableOpacity style={styles.viewAll}>
							<Text style={styles.viewAllText}>
								View All
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.wishListContainer}>
						{this.state.wishListJsx}
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
	wishListContainer: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 5,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	wishListHeader: {
		paddingLeft: 25,
		paddingRight: 25,
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flex: 1,
	},
	viewAllText: {
		color: '#22a7f0',
	},
});

