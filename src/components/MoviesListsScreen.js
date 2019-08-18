import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	ImageBackground,
	Text,
	TouchableOpacity,
	RefreshControl,
	ActivityIndicator,
	StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import ListItem from './ListItem';
import SearchItem from './SearchItem';
import db from '../db/db';

export default class MoviesListsScreen extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			refreshing: false,
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
			watchedListJsx: [<ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />],
		};

		this.getUsername = () => {
			return new Promise((resolve, reject) => {
				let username = AsyncStorage.getItem('USER_KEY');
				resolve(username)
				.catch(error => console.warn('ERROR in getUsername ' + error.message));
			});
		};

		this.initLists = () => {
			return new Promise((resolve, reject) => {
				this.getUsername()
					.then(result => {
						this.setState({ username: result });
						console.warn(result);
						db.getHistory(result, 'wishList', 'movie')
							.then(result => {
								let len = result.length;
								if (len > 0) {
									// If there's atleast one title in the wishList, display it
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
								} else {
									// If there are no titles in wishList, display an empty box
									this.setState({
										wishListJsx: [
											<ListItem
												titleId=""
												title=""
												overview=""
												voteCount=""
												voteAverage=""
												posterPath=""
												onItemPressed=""
												listType="Wish-list"
											/>,
										],
									});
								}
							}, error => console.warn(error));

						db.getHistory(result, 'watchedList', 'movie')
							.then(result => {
								let len = result.length;
								let titleIds = [];
								let titles = [];
								let voteCounts = [];
								let voteAverages = [];
								let posterPaths = [];
								let partialOverviews = [];
								let newWatchedListJsx = [];

								// If len >= 3, display latest 3 Watched-list titles
								// If len < 3, display as many Watched-list titles
								let safeMinus = '';
								if (len >= 4) { safeMinus = 3; }
								else { safeMinus = len; }

								if (len > 0) {
									// If atleast one movie is listed in watchedList display it
									for (let i = len - 1; i >= len - safeMinus; i--) {
										titleIds.push(result[i].titleId);
										titles.push(result[i].titleName);

										let fullOverview = result[i].titleOverview;
										// Limit overview to 150 characters or less

										let partialOverview = fullOverview.length <= 100 ? fullOverview :
											fullOverview.slice(0, 150) + '...';

										partialOverviews.push(partialOverview);
										voteCounts.push(result[i].titleVoteCount);
										voteAverages.push(result[i].titleVoteAverage);
										posterPaths.push(result[i].titlePosterPath);

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
									resolve(true);
								} else {
									// If there are no movies in WatchedList, display empty box
									this.setState({
										watchedListJsx: [
											<ListItem
												titleId=""
												title=""
												overview=""
												voteCount=""
												voteAverage=""
												posterPath=""
												onItemPressed=""
												listType="Watched-list"
											/>,
										],
									});
									resolve(true);
								}
							}, error => console.warn(error));
					}, error => console.warn(error));
			});
		};
	}

	_onRefresh = () => {
		this.setState({
			refreshing: true,
			wishListJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
			watchedListJsx: [<ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />],
		});
		this.initLists().then((result) => {
			this.setState({
				refreshing: false,
			});
		});
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

	viewAllPressedHandler = (listType) => {
		let isListEmpty = false;
		switch (listType) {
			case 'wishList':
				if (this.state.wishList.titleId === '') { isListEmpty = true; }
				break;
			case 'watchedList':
				if (this.state.watchedList.titleIds.length === 0) { isListEmpty = true; }
				break;
			default: null;
		}
		if (!isListEmpty) {
			// Handle button press only is list isn't empty
			this.props.navigation.navigate('FullListScreen', {
				listType,
				titleType: 'movie',
				username: this.state.username,
			});
		}
	}

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
		let {wishListJsx, watchedListJsx} = this.state;
		return (
			<ImageBackground blurRadius={1.3}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				<StatusBar barStyle="dark-content"
					translucent={true}
					backgroundColor="rgba(238, 238, 238, 0)"
				/>
				<ScrollView style={styles.scrollView}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh}
						/> }>
					<View style={styles.container}>
						<SearchItem onChangeText={this.searchFieldChangedHandler}
							placeholder="Search a movie"
							onSubmitEditing={this.searchBtnPressedHandler} />
					</View>
					<View style={styles.listHeader}>
						<Text>
							Wish List
							</Text>
						<TouchableOpacity style={styles.viewAll} onPress={() => this.viewAllPressedHandler('wishList')}>
							<Text style={styles.viewAllText}>
								View All
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.wishListContainer}>
						{wishListJsx}
					</View>
					<View style={styles.listHeader}>
						<Text>
							Watched List
							</Text>
						<TouchableOpacity style={styles.viewAll} onPress={() => this.viewAllPressedHandler('watchedList')}>
							<Text style={styles.viewAllText}>
								View All
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.watchedListContainer}>
						{watchedListJsx}
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
		marginTop: 5,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	watchedListContainer: {
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

