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
import Carousel from 'react-native-snap-carousel';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import ListItem from './ListItem';
import SearchItem from './SearchItem';
import db from '../db/db_exp';
import netCon from '../util/NetCon';
import CustomSnackbar from '../util/Snackbar';
import { onSignOut } from '../auth/auth';

export default class MoviesListsScreen extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			refreshing: false,
			username: '',
			uuid: '',
			searchQuery: '',
			filterYear: '',
			filterShown: false,
			movieRecoms: [
				{
					title: 'The Green Mile' ,
					titleId: 497 ,
					posterPath: 'sOHqdY1RnSn6kcfAHKu28jvTebE.jpg',
				},
				{
					title: 'The Shawshank Redemption',
					titleId: 278,
					posterPath: '9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
				},
				{
					title: 'Good Will Hunting',
					titleId: 489,
					posterPath: 'jq8LjngZ7XZEQge5JFTdOGMrHyZ.jpg',
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
			wishListJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
			watchedListJsx: [<ActivityIndicator size="large" color="#674172" style={styles.indicator} />],
		};

		this.getUserId = () => {
			return new Promise((resolve, reject) => {
				AsyncStorage.multiGet(['USER_KEY', 'UUID'])
					.then(storedValues => {
						// storedValues is a 2D array
						let username = storedValues[0][1];
						let uuid = storedValues[1][1];
						resolve({
							username,
							uuid,
						});
					})
					.catch(error => console.warn(error.message));
			});
		};

		this.initLists = () => {
			return new Promise((resolve, reject) => {
				this.getUserId()
					.then(result => {
						this.setState({ username: result.username, uuid: result.uuid });
						db.getHistory(result.uuid, 'wishList', 'movie')
							.then(result => {
								let len = result.length;
								if (len > 0) {
									// If there's atleast one title in the wishList, display it
									let fullOverview = result[len - 1].titleOverview;
									// Limit overview to 150 characters or less
									let partialOverview = fullOverview.length <= 100 ? fullOverview :
										fullOverview.slice(0, 150) + '...';
									// Set latest addition to state
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
							}, error => {
								if (error === 'NOT-FOUND') {
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
								console.warn(error);
							});

						db.getHistory(result.uuid, 'watchedList', 'movie')
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
							}, error => {
								if (error === 'NOT-FOUND') {
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
								}
								console.warn(error);
								resolve(true);
							});
					}, error => console.warn(error));
			});
		};

		this._renderItem = (item, index) => {
			let imgSrc = `https://image.tmdb.org/t/p/w200/${item.item.posterPath}`;
			return (
				<TouchableOpacity style={styles.carouselItemContainer}
					onPress={() => {
						this.onListItemSelected(item.item.titleId, item.item.title);
					}}>
					<Image source={{ uri: imgSrc }}
						style={styles.carouselImage} />
					<Text style={styles.carouselText}>{item.item.title}</Text>
				</TouchableOpacity>
			);
		};

		this._onRefresh = () => {
			this.setState({
				refreshing: true,
				wishListJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
				watchedListJsx: [<ActivityIndicator size="large" color="#674172" style={styles.indicator} />],
			});
			this.initLists().then((result) => {
				this.setState({
					refreshing: false,
				}, () => {
						db.getTitleRecommendations(this.state.uuid, 'movie')
							.then(result => {
								console.warn('getTitleR called!');
								// Promise takes time to resolve..
								// wait 5 seconds before updating state.
								setTimeout(() => {
									// Update state only if the resolved promise..
									// is not empty.
									result.length > 0 ?
										this.setState({ movieRecoms: this.state.movieRecoms.concat(result) }, () => {
										}) : null;
								}, 3000);
							}, error => console.warn('ERROR in getTitleRecommendations/ MoviesListsScreen' + error))
							.catch(error => console.warn('CAUGHT ERROR in getTitleRecommendations/ MoviesListsScreen' + error));
				});
			});
		};
	}

	searchFieldChangedHandler = (newQuery) => {
		this.setState({
			searchQuery: newQuery,
		});
	};

	filterYearChangedHandler = (newYear) => {
		this.setState({
			filterYear: newYear.replace(/[^0-9]/g, ''),
		});
	};

	filterShown = (isShown) => {
		if (isShown) {
			this.setState({scrollViewMargin: 120, filterShown: true});
		} else {
			this.setState({scrollViewMargin: 60, filterShown: false});
		}
	};

	searchBtnPressedHandler = () => {
		netCon.checkNetCon()
			.then((result) => {
				if (this.state.searchQuery.trim() === '') {
					// Search query is empty
				} else {
					this.props.navigation.navigate('SearchScreen', {
						searchQuery: this.state.searchQuery,
						releaseYear: this.state.filterShown ? this.state.filterYear : null,
						searchType: 'm',
						username: this.state.username,
						uuid: this.state.uuid,
					});
				}
			}, (error) => {
				netCon.showSnackBar('An internet connection is required!');
			});
	};

	viewAllPressedHandler = (listType) => {
		netCon.checkNetCon()
			.then((result) => {
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
						uuid: this.state.uuid,
					});
				}
			}, (error) => {
				netCon.showSnackBar('An internet connection is required!');
			});
	}

	componentDidMount() {
		netCon.checkNetCon()
			.then((result) => {
				CustomSnackbar.showSnackBar('Initializing the app...', 'always', '#3fc380', 'Hide');

				// Get recommendations from recently listed movies for the current user
				this.getUserId()
					.then(result => {
						console.warn('getTitleR going to be called!');
						db.getTitleRecommendations(result.uuid, 'movie')
							.then(result => {
								console.warn('getTitleR called!');
								// Promise takes time to resolve..
								// wait 3 seconds before updating state.
								setTimeout(() => {
									// Update state only if the resolved promise..
									// is not empty.
									result.length > 0 ?
										this.setState({ movieRecoms: this.state.movieRecoms.concat(result) }, () => {
										}) : null;
								}, 3000);
							}, error => console.warn('ERROR in getTitleRecommendations/ MoviesListsScreen' + error))
							.catch(error => console.warn('CAUGHT ERROR in getTitleRecommendations/ MoviesListsScreen' + error));

						fetch('https://api-cine-digest.herokuapp.com/api/v1')
							.then(() => CustomSnackbar.dismiss());
					});
				this.initLists();
			}, (error) => {
				// Display SignedOut layout if no internet connection
				this.props.navigation.navigate('SignedOut');
			});
	}

	onListItemSelected = (itemId, itemTitle) => {
		netCon.checkNetCon()
			.then((result) => {
				this.props.navigation.navigate('MovieDetailsScreen', {
					titleId: itemId,
					screenName: itemTitle,
					username: this.state.username,
					uuid: this.state.uuid,
				});
			}, (error) => {
				netCon.showSnackBar('An internet connection is required!');
			});
	};

    render() {
		let {wishListJsx, watchedListJsx} = this.state;
		let fabJsx =
			<ActionButton
				buttonColor="#9b59b6"
				position="right"
				style={styles.fab}
				shadowStyle={styles.fabShadow}
				renderIcon= {active => active ?
					(<FeatherIcon name="settings" style={styles.actionButtonIcon} size={30} />)
					: (<FeatherIcon name="settings" style={styles.actionButtonIcon} />)} >
						<ActionButton.Item buttonColor="#1abc9c"
					title="About the app"
					style={styles.actionButtonItem}
					onPress={(() => this.props.navigation.navigate('AboutScreen'))}>
					<EntypoIcon name="info" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item buttonColor="#db0a5b"
					title="Sign out"
					style={styles.actionButtonItem}
					onPress={(() => onSignOut().then(() => this.props.navigation.navigate('SignedOut')))}>
					<SimpleLineIcons name="logout" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>;
		return (
			<ImageBackground blurRadius={2}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				<StatusBar barStyle="light-content"
					translucent={true}
					backgroundColor="#913d88"
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

