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
			watchedList: {
				titleIds: [],
				titles: [],
				overviews: [],
				posterPaths: [],
				voteAverages: [],
				voteCounts: [],
			},
			wishListJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
		watchedListJsx: [<ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,],
		};

		this.getUsername = () => {
			return new Promise((resolve, reject) => {
				let username = AsyncStorage.getItem('USER_KEY');
				resolve(username)
				.catch(error => console.warn('ERROR in getUsername ' + error.message));
			});
		};

		this.initLists = () => {
			this.getUsername()
			.then(result => {
				this.setState({username: result});
				db.getHistory(result, 'wishList')
					.then(result => {
						let len = result.length;
						let fullOverview = result[len - 1].titleOverview;
						// Limit overview to 150 characters or less
						let partialOverview = fullOverview.length <= 100 ? fullOverview :
							fullOverview.slice(0, 150) + '...';
						// Set latest addition to state

						console.warn('LENGTH: ' + result.length);
						this.setState({
							wishList: {
								titleId: result[len - 1].titleId,
								title: result[len - 1].titleName,
								overview: partialOverview,
								voteCount: result[len - 1].titleVoteCount,
								voteAverage: result[len - 1].titleVoteAverage,
								posterPath: result[len - 1].titlePosterPath,
							},
							wishListJsx:
								<ListItem
									titleId={result[len - 1].titleId}
									title={result[len - 1].titleName}
									overview={partialOverview}
									voteCount={result[len - 1].titleVoteCount}
									voteAverage={result[len - 1].titleVoteAverage}
									posterPath={result[len - 1].titlePosterPath}
									onItemPressed={() => this.onListItemSelected(result[len - 1].titleId, result[len - 1].titleName)}
								/>,
						});
					}, error => console.warn(error));

				db.getHistory(result, 'watchedList')
					.then(result => {
						let len = result.length;
						let titleIds = [];
						let titles = [];
						let voteCounts = [];
						let voteAverages = [];
						let posterPaths = [];
						let partialOverviews = [];
						let newWatchedListJsx = [];

						for (let i = len - 3; i < len; i++) {
							titleIds.push(result[i].titleId);
							titles.push(result[i].titles);

							let fullOverview = result[i].titleOverview;
							// Limit overview to 150 characters or less

							let partialOverview = fullOverview.length <= 100 ? fullOverview :
								fullOverview.slice(0, 150) + '...';

							partialOverviews.push(partialOverview);
							voteCounts.push(result[i].voteCount);
							voteAverages.push(result[i].voteAverage);
							posterPaths.push(result[i].posterPath);

							newWatchedListJsx.push(<ListItem
								titleId={result[i].titleId}
								title={result[i].titleName}
								overview={partialOverview}
								voteCount={result[i].titleVoteCount}
								voteAverage={result[i].titleVoteAverage}
								posterPath={result[i].titlePosterPath}
								onItemPressed={() => this.onListItemSelected(result[i].titleId, result[i].titleName)}
							/>);
						}

						// Set latest addition to state
						this.setState({
							watchedList: {
								titleIds,
								titles,
								overviews: partialOverviews,
								voteCounts,
								voteAverages,
								posterPaths,
							},
							watchedListJsx: newWatchedListJsx,
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
		this.initLists();
	}

	onListItemSelected = (itemId, itemTitle) => {
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
					<View style={styles.listHeader}>
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
					<View style={styles.listHeader}>
						<Text>
							Watched List
							</Text>
						<TouchableOpacity style={styles.viewAll}>
							<Text style={styles.viewAllText}>
								View All
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.watchedListContainer}>
						{this.state.watchedListJsx}
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
	watchedListContainer: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 5,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	listHeader: {
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

