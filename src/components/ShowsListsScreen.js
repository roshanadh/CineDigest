import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	ImageBackground,
	TouchableOpacity,
	ActivityIndicator,
	RefreshControl,
	Text,
	Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import ListItem from './ListItem';
import SearchItem from './SearchItem';
import db from '../db/db';
import netCon from '../util/NetCon';

export default class MoviesScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			refreshing: false,
			username: '',
			searchQuery: '',
			recentShows: [],
			wishList: {
				titleId: '',
				title: '',
				overview: '',
				posterPath: '',
				voteAverage: '',
				voteCount: '',
			},
			watchingList: {
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
			watchingListJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
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
						db.getHistory(result, 'wishList', 'show')
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

						db.getHistory(result, 'watchingList', 'show')
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
										watchingList: {
											titleId: result[len - 1].titleId,
											title: result[len - 1].titleName,
											overview: partialOverview,
											voteCount: result[len - 1].titleVoteCount,
											voteAverage: result[len - 1].titleVoteAverage,
											posterPath: result[len - 1].titlePosterPath,
										},
										watchingListJsx:
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
										watchingListJsx: [
											<ListItem
												titleId=""
												title=""
												overview=""
												voteCount=""
												voteAverage=""
												posterPath=""
												onItemPressed=""
												listType="Watching-list"
											/>,
										],
									});
								}
							}, error => console.warn(error));

						db.getHistory(result, 'watchedList', 'show')
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

		this._renderItem = (item, index) => {
			return (
				<TouchableOpacity style={styles.carouselItemContainer}
					onPress={() => {
						this.onListItemSelected(item.item.titleId, item.item.title);
					}}>
					<Image source={{ uri: item.item.posterPath }}
						style={styles.carouselImage} />
					<Text style={styles.carouselText}>{item.item.title}</Text>
				</TouchableOpacity>
			);
		};
	}

	_onRefresh = () => {
		this.setState({
			refreshing: true,
			wishListJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
			watchingListJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
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
		netCon.checkNetCon()
			.then((result) => {
				this.props.navigation.navigate('SearchScreen', {
					searchQuery: this.state.searchQuery,
					searchType: 's',
					username: this.state.username,
				});
			}, (error) => {
				netCon.showSnackBar('An internet connection is required!');
			});
	};

	getUsername = async () => {
		let username = await AsyncStorage.getItem('USER_KEY');
		this.setState({ username });
	}

	onListItemSelected = (itemId, itemTitle) => {
		netCon.checkNetCon()
			.then((result) => {
				this.props.navigation.navigate('ShowDetailsScreen', {
					titleId: itemId,
					screenName: itemTitle,
					username: this.state.username,
				});
			}, (error) => {
				netCon.showSnackBar('An internet connection is required!');
			});
	};

	viewAllPressedHandler = (listType) => {
		let isListEmpty = false;
		switch (listType) {
			case 'wishList':
				if (this.state.wishList.titleId === '') { isListEmpty = true; }
				break;
			case 'watchingList':
				if (this.state.watchingList.titleId === '') { isListEmpty = true; }
				break;
			case 'watchedList':
				if (this.state.watchedList.titleIds.length === 0) { isListEmpty = true; }
				break;
			default: null;
		}
		console.warn('ShowsLists: ' + isListEmpty);
		if (!isListEmpty) {
			// Handle button press only is list isn't empty
			this.props.navigation.navigate('FullListScreen', {
				listType,
				titleType: 'show',
				username: this.state.username,
			});
		}
	}


	componentDidMount() {
		// Get recently listed shows for the current user
		this.getUsername()
			.then((result) => {
				db.getRecentShows(result)
					.then((result) => {
						this.setState({ recentShows: result }, () => console.warn(this.state.recentShows[0]));
					}, (error) => console.warn('ERROR in getRecentShows/ ShowsListsScreen' + error));
			});
		this.initLists();
	}

    render() {
		return (
			<ImageBackground blurRadius={1.3}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				<View style={styles.searchItem}>
					<SearchItem onChangeText={this.searchFieldChangedHandler}
						style={styles.searchItem}
						placeholder="Search a TV show"
						searchType="show"
						onSubmitEditing={this.searchBtnPressedHandler} />
				</View>
				<ScrollView style={styles.scrollView}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh}
						/> }>

					<View style={styles.carouselContainer}>
						<Carousel
							layout={'default'}
							data={this.state.recentShows}
							sliderWidth={250}
							itemWidth={150}
							autoplay={true}
							loop={true}
							renderItem={this._renderItem} />
					</View>

					<View style={styles.listHeader}>
						<View style={styles.listName}>
							<Text>
								Wish List
							</Text>
						</View>
						<TouchableOpacity style={styles.viewAll}
							onPress={() => this.viewAllPressedHandler('wishList')}>
							<Text style={styles.viewAllText}>
								View All
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.wishListContainer}>
						{this.state.wishListJsx}
					</View>
					<View style={styles.listHeader}>
						<View style={styles.listName}>
							<Text>
								Watching List
							</Text>
						</View>
						<TouchableOpacity style={styles.viewAll}
							onPress={() => this.viewAllPressedHandler('watchingList')}>
							<Text style={styles.viewAllText}>
								View All
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.watchingListContainer}>
						{this.state.watchingListJsx}
					</View>
					<View style={styles.listHeader}>
						<View style={styles.listName}>
							<Text>
								Watched List
							</Text>
						</View>
						<TouchableOpacity style={styles.viewAll}
							onPress={() => this.viewAllPressedHandler('watchedList')}>
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
	searchItem: {
		position: 'absolute',
		top: 0,
		width: '100%',
		zIndex: 1,
	},
	scrollView: {
		marginTop: 60,
	},
	carouselContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		width: '100%',
		paddingBottom: 20,
	},
	carouselItemContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		borderRadius: 15,
	},
	carouselImage: {
		width: 150,
		height: 200,
		borderRadius: 10,
	},
	carouselText: {
		marginTop: 10,
		fontSize: 15,
		color: '#2e3131',
	},
	wishListContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	watchingListContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	watchedListContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	listHeader: {
		paddingLeft: 10,
		paddingRight: 25,
		marginTop: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flex: 1,
	},
	listName: {
		padding: 10,
		marginBottom: 0,
		backgroundColor: 'rgba(218, 223, 225, 0.5)',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	viewAll: {
		paddingTop: 10,
	},
	viewAllText: {
		fontSize: 15,
		color: '#22a7f0',
	},
});
