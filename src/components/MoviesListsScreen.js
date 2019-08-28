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
	Image,
	Dimensions,
} from 'react-native';

import ActionButton from 'react-native-action-button';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import Carousel from 'react-native-snap-carousel';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import ListItem from './ListItem';
import SearchItem from './SearchItem';
import db from '../db/db';
import netCon from '../util/NetCon';
import { onSignOut } from '../auth/auth';

export default class MoviesListsScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			refreshing: false,
			username: '',
			searchQuery: '',
			filterYear: '',
			movieRecoms: [
				{
					title: 'The Green Mile' ,
					titleId: 497 ,
					posterPath: 'https://image.tmdb.org/t/p/original/sOHqdY1RnSn6kcfAHKu28jvTebE.jpg',
				},
				{
					title: 'The Shawshank Redemption',
					titleId: 278,
					posterPath: 'https://image.tmdb.org/t/p/original/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
				},
				{
					title: 'Good Will Hunting',
					titleId: 489,
					posterPath: 'https://image.tmdb.org/t/p/original/jq8LjngZ7XZEQge5JFTdOGMrHyZ.jpg',
				},
			],
			scrollViewMargin: 60,
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

	filterYearChangedHandler = (newYear) => {
		this.setState({
			filterYear: newYear,
		});
	};

	filterShown = (isShown) => {
		console.warn(isShown + ' is shown!');
		if (isShown) {
			this.setState({scrollViewMargin: 120});
		} else {
			this.setState({scrollViewMargin: 60});
		}
	};

	searchBtnPressedHandler = () => {
		netCon.checkNetCon()
			.then((result) => {
				this.props.navigation.navigate('SearchScreen', {
					searchQuery: this.state.searchQuery,
					releaseYear: this.state.filterYear,
					searchType: 'm',
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
		Snackbar.show({
			title: 'Initializing the app',
			duration: Snackbar.LENGTH_INDEFINITE,
			color: '#fefefe',
			fontSize: 16,
			backgroundColor: '#3fc380',
		});
		// Get recommendations from recently listed movies for the current user
		this.getUsername()
			.then((result) => {
				db.getTitleRecommendations(result, 'movie')
					.then((result) => {
						// Promise takes time to resolve..
						// wait 5 seconds before updating state.
						setTimeout(() => {
							// Update state only if the resolved promise..
							// is not empty.
							result.length > 0 ?
								this.setState({ movieRecoms: this.state.movieRecoms.concat(result) }, () => {
								}) : null;
						}, 3000);
					}, (error) => console.warn('ERROR in getTitleRecommendations/ MoviesListsScreen' + error))
					.catch(error => console.warn('CAUGHT ERROR in getTitleRecommendations/ MoviesListsScreen' + error));
				fetch('https://api-cine-digest.herokuapp.com/api/v1')
					.then(() => Snackbar.dismiss());
			});
		this.initLists();
	}

	onListItemSelected = (itemId, itemTitle) => {
		netCon.checkNetCon()
			.then((result) => {
				this.props.navigation.navigate('MovieDetailsScreen', {
					titleId: itemId,
					screenName: itemTitle,
					username: this.state.username,
				});
			}, (error) => {
				netCon.showSnackBar('An internet connection is required!');
			});
	};

    render() {
		let {wishListJsx, watchedListJsx} = this.state;
		let fabJsx =
			<ActionButton
				buttonColor="#1abc9c"
				position="right"
				style={styles.fab}
				shadowStyle={styles.fabShadow}
				renderIcon= {active => active ?
					(<FeatherIcon name="settings" style={styles.actionButtonIcon} size={30} />)
					: (<FeatherIcon name="settings" style={styles.actionButtonIcon} />)} >

				<ActionButton.Item buttonColor="#db0a5b"
					title="Sign out"
					style={styles.actionButtonItem}
					onPress={(() => onSignOut().then(() => this.props.navigation.navigate('SignedOut')))}>
					<SimpleLineIcons name="logout" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>;
		return (
			<ImageBackground blurRadius={1.3}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				<StatusBar barStyle="light-content"
					translucent={true}
					backgroundColor="#6bb9f0"
				/>
				<View style={styles.searchItem}>
					<SearchItem onChangeText={this.searchFieldChangedHandler}
						onChangeYear={this.filterYearChangedHandler}
						placeholder="Search a movie"
						searchType="movie"
						filterShown={this.filterShown}
						onSubmitEditing={this.searchBtnPressedHandler} />
				</View>
				{fabJsx}
				<ScrollView style={{marginTop: this.state.scrollViewMargin}}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this._onRefresh}
						/> }>
					<View style={styles.carouselContainer}>
						<Carousel
							layout={'default'}
							data={this.state.movieRecoms}
							sliderWidth={Dimensions.get('window').width}
							itemWidth={150}
							autoplay={true}
							autoplayInterval={5000}
							firstItem={1}
							loop={true}
							loopClonesPerSide={0}
							renderItem={this._renderItem} />
						</View>
					<View style={styles.listHeader}>
						<View style={styles.listName}>
							<Text>
								Wish List
							</Text>
						</View>
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
						<View style={styles.listName}>
							<Text>
								Watched List
							</Text>
						</View>
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
	searchItem: {
		position: 'absolute',
		top: 0,
		width: '100%',
		zIndex: 1,
		padding: 0,
	},
	fab: {
		zIndex: 1,
	},
	fabShadow: {
		borderRadius: 50,
		borderWidth: 1,
		borderColor: 'rgba(217, 30, 24, 0.1)',
	},
	actionButtonIcon: {
		fontSize: 20,
		color: '#fefefe',
	},
	actionButtonItem: {
		fontSize: 16,
	},
	carouselContainer: {
		marginTop: 20,
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		width: '100%',
		paddingBottom: 20,
	},
	carouselItemContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15,
	},
	carouselImage: {
		width: 150,
		height: 200,
		borderRadius: 10,
	},
	carouselText: {
		width: 150,
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 15,
		color: '#2e3131',
		textAlign: 'center',
	},
	wishListContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		marginBottom: 20,
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
		color: '#22a7f0',
		fontSize: 15,
	},
});

