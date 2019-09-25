import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';

import CustomSnackbar from '../util/Snackbar';
import db from '../db/db_exp';
import netCon from '../util/NetCon';

export default class ShowDetailsScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('screenName', 'Show Details'),
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#913d88',
                elevation: 0,
            },
        };
    }
    constructor(props) {
        super(props);
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        this.state = {
            username: '',
            uuid: '',
            titleId: '',
            title: '',
            backdropPath: '',
            createdBy: [],
            voteAverage: '',
            voteCount: '',
            seasons: [],
            episodeRuntime: [],
            status: '',
            firstAirDate: '',
            lastAirDate: '',
            nextEpisodeToAir: '',
            genres: [],
            networks: [],
            numberOfEpisodes: '',
            overview: '',
            posterPath: '',
            originalPosterPath: '',
            wishListBtnJsx: <ActivityIndicator size="small" color="#674172" style={styles.indicator} />,
            watchingListBtnJsx: <ActivityIndicator size="small" color="#674172" style={styles.indicator} />,
            watchedListBtnJsx: <ActivityIndicator size="small" color="#674172" style={styles.indicator} />,
            contentJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
        };
        this.noBackdrop = false;
        this.noPoster = false;

        this.initButtons = (username, uuid, titleId) => {
            return new Promise((resolve, reject) => {
                this.setState({
                    contentJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
                });
                // Check if show is in Wish-list
                db.isInList('wishList', this.state.titleId, uuid, 'show')
                    .then(result => {
                        // Show is already in Wish-list
                        this.setState({
                            wishListBtnJsx:
                                <TouchableOpacity style={styles.removeFromListBtn}
                                    onPress={() =>
                                        netCon.checkNetCon()
                                            .then(success => {
                                                // Internet connection available
                                                this.removeFromList('wishList');
                                            }, error => {
                                                // Internet connection unavailable
                                                CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                            })
                                }>
                                    <Text style={styles.btnText}>Remove from Wish-list</Text>
                                </TouchableOpacity>,
                            // If show is in Wish-list, it cannot be already in
                            // Watched-list or Watching-list
                            watchingListBtnJsx:
                                <TouchableOpacity style={styles.watchingListBtn}
                                    onPress={() =>
                                        netCon.checkNetCon()
                                            .then(success => {
                                                // Internet connection available
                                                this.addToWatchingList();
                                            }, error => {
                                                // Internet connection unavailable
                                                CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                            })
                                }>
                                    <Text style={styles.btnText}>Add to Watching-list</Text>
                                </TouchableOpacity>,
                            watchedListBtnJsx:
                                <TouchableOpacity style={styles.watchedListBtn}
                                    onPress={() =>
                                        netCon.checkNetCon()
                                            .then(success => {
                                                // Internet connection available
                                                this.addToWatchedList();
                                            }, error => {
                                                // Internet connection unavailable
                                                CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                            })
                                }>
                                    <Text style={styles.btnText}>Add to Watched-list</Text>
                                </TouchableOpacity>,
                        }, () =>
                        {
                            this.initScreen();
                            resolve(true);
                        });
                    }, error => {
                        // Show is not in Wish-list
                        // Check if it is in Watching-list
                        db.isInList('watchingList', this.state.titleId, uuid, 'show')
                            .then(result => {
                                // Show is in Watching-list
                                // Add to Wish-list btn is disabled,
                                // Remove from Watching-list, and
                                // Add to Watched-list buttons are present
                                this.setState({
                                    wishListBtnJsx:
                                        <TouchableOpacity style={styles.disabledBtn}
                                            onPress={() =>
                                                netCon.checkNetCon()
                                                    .then(success => {
                                                        // Internet connection available
                                                        this.displayAlreadyInList('watching', this.state.title);
                                                    }, error => {
                                                        // Internet connection unavailable
                                                        CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                    })
                                        }>
                                            <Text style={styles.disabledBtnText}>Add to Wish-list</Text>
                                        </TouchableOpacity>,
                                    watchingListBtnJsx:
                                        <TouchableOpacity style={styles.removeFromListBtn}
                                            onPress={() =>
                                                netCon.checkNetCon()
                                                    .then(success => {
                                                        // Internet connection available
                                                        this.removeFromList('watchingList');
                                                    }, error => {
                                                        // Internet connection unavailable
                                                        CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                    })
                                        }>
                                            <Text style={styles.btnText}>Remove from Watching-list</Text>
                                        </TouchableOpacity>,
                                    watchedListBtnJsx:
                                        <TouchableOpacity style={styles.watchedListBtn}
                                            onPress={() =>
                                                netCon.checkNetCon()
                                                    .then(success => {
                                                        // Internet connection available
                                                        this.addToWatchedList();
                                                    }, error => {
                                                        // Internet connection unavailable
                                                        CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                    })
                                        }>
                                            <Text style={styles.btnText}>Add to Watched-list</Text>
                                        </TouchableOpacity >,
                                }, () =>
                                {
                                    this.initScreen();
                                    resolve(true);
                                });
                            }, error => {
                                // Show is not in Watching-list
                                // Check if it is in Watched-list
                                    db.isInList('watchedList', this.state.titleId, uuid, 'show')
                                        .then(result => {
                                            // Show is in Watched-list
                                            // Add to Wish-list and
                                            // Add to Watching-list buttons are disabled,
                                            // Remove from Watched-list button is present
                                            this.setState({
                                                wishListBtnJsx:
                                                    <TouchableOpacity style={styles.disabledBtn}
                                                        onPress={() =>
                                                            netCon.checkNetCon()
                                                                .then(success => {
                                                                    // Internet connection available
                                                                    this.displayAlreadyInList('watched', this.state.title);
                                                                }, error => {
                                                                    // Internet connection unavailable
                                                                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                                })
                                                    }>
                                                        <Text style={styles.disabledBtnText}>Add to Wish-list</Text>
                                                    </TouchableOpacity>,
                                                watchingListBtnJsx:
                                                    <TouchableOpacity style={styles.disabledBtn}
                                                        onPress={() =>
                                                            netCon.checkNetCon()
                                                                .then(success => {
                                                                    // Internet connection available
                                                                    this.displayAlreadyInList('watched', this.state.title);
                                                                }, error => {
                                                                    // Internet connection unavailable
                                                                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                                })
                                                    }>
                                                        <Text style={styles.disabledBtnText}>Add to Watching-list</Text>
                                                    </TouchableOpacity>,
                                                watchedListBtnJsx:
                                                    <TouchableOpacity style={styles.removeFromListBtn}
                                                        onPress={() =>
                                                            netCon.checkNetCon()
                                                                .then(success => {
                                                                    // Internet connection available
                                                                    this.removeFromList('watchedList');
                                                                }, error => {
                                                                    // Internet connection unavailable
                                                                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                                })
                                                    }>
                                                        <Text style={styles.btnText}>Remove from Watched-list</Text>
                                                    </TouchableOpacity>,
                                            }, () =>
                                            {
                                                this.initScreen();
                                                resolve(true);
                                            });
                                        }, error => {
                                            // Show is not in Watched-list either
                                            // Display all addToList buttons normally
                                                this.setState({
                                                    wishListBtnJsx:
                                                        <TouchableOpacity style={styles.wishListBtn}
                                                            onPress={() =>
                                                                netCon.checkNetCon()
                                                                    .then(success => {
                                                                        // Internet connection available
                                                                        this.addToWishList();
                                                                    }, error => {
                                                                        // Internet connection unavailable
                                                                        CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                                    })
                                                        }>
                                                            <Text style={styles.btnText}>Add to Wish-list</Text>
                                                        </TouchableOpacity>,
                                                    watchingListBtnJsx:
                                                        <TouchableOpacity style={styles.watchingListBtn}
                                                            onPress={() =>
                                                                netCon.checkNetCon()
                                                                    .then(success => {
                                                                        // Internet connection available
                                                                        this.addToWatchingList();
                                                                    }, error => {
                                                                        // Internet connection unavailable
                                                                        CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                                    })
                                                        }>
                                                            <Text style={styles.btnText}>Add to Watching-list</Text>
                                                        </TouchableOpacity>,
                                                    watchedListBtnJsx:
                                                        <TouchableOpacity style={styles.watchedListBtn}
                                                            onPress={() =>
                                                                netCon.checkNetCon()
                                                                    .then(success => {
                                                                        // Internet connection available
                                                                        this.addToWatchedList();
                                                                    }, error => {
                                                                        // Internet connection unavailable
                                                                        CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                                                                    })
                                                        }>
                                                            <Text style={styles.btnText}>Add to Watched-list</Text>
                                                        </TouchableOpacity >,
                                                }, () =>
                                                {
                                                    this.initScreen();
                                                    resolve(true);
                                                });
                                        });
                                    });
                            });
                    });
        };

        this.getUserId = () => {
            return new Promise((resolve, reject) => {
                let username = this.props.navigation.getParam('username', null);
                let uuid = this.props.navigation.getParam('uuid', null);
                this.setState({ username, uuid }, () => {
                    this.initButtons(username, uuid, this.state.titleId)
                        .then(() => resolve(true))
                        .catch(error => console.warn(error.message));
                });
            });
        };

        this.addToWishList = () => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                Alert.alert('Are you sure?', this.state.title + ' will be added to your wish-list!',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                db.addShowToWishList({
                                    listType: 'wishList',
                                    titleId: this.state.titleId,
                                    titleName: this.state.title,
                                    titleOverview: this.state.overview,
                                    titleVoteCount: this.state.voteCount,
                                    titleVoteAverage: this.state.voteAverage,
                                    titlePosterPath: this.state.posterPath,
                                    titleType: 'show',
                                    uuid: this.state.uuid,
                                })
                                    .then(result => {
                                        this.initButtons(this.state.username, this.state.uuid, this.state.titleId);
                                    }, error => {
                                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                                    });
                            },
                        },
                    ]
                );
            }
        };

        this.addToWatchingList = () => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                Alert.alert('Are you sure?', this.state.title + ' will be added to your watching-list!',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                db.addShowToWatchingList({
                                    listType: 'watchingList',
                                    titleId: this.state.titleId,
                                    titleName: this.state.title,
                                    titleOverview: this.state.overview,
                                    titleVoteCount: this.state.voteCount,
                                    titleVoteAverage: this.state.voteAverage,
                                    titlePosterPath: this.state.posterPath,
                                    titleType: 'show',
                                    uuid: this.state.uuid,
                                })
                                    .then(result => {
                                        this.initButtons(this.state.username, this.state.uuid, this.state.titleId);
                                    }, error => {
                                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                                    });
                            },
                        },
                    ]
                );
            }
        };

        this.addToWatchedList = () => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                Alert.alert('Are you sure?', this.state.title + ' will be added to your watched-list!',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                db.addShowToWatchedList({
                                    listType: 'watchedList',
                                    titleId: this.state.titleId,
                                    titleName: this.state.title,
                                    titleOverview: this.state.overview,
                                    titleVoteCount: this.state.voteCount,
                                    titleVoteAverage: this.state.voteAverage,
                                    titlePosterPath: this.state.posterPath,
                                    titleType: 'show',
                                    uuid: this.state.uuid,
                                })
                                    .then(result => {
                                        this.initButtons(this.state.username, this.state.uuid, this.state.titleId);
                                    }, error => {
                                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                                    });
                            },
                        },
                    ]
                );
            }
        };


        this.removeFromList = (listType) => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                let message = '';
                // Re-render this Screen
                if (listType === 'wishList') {
                    message = this.state.title + ' will be removed from your wish-list!';
                } else if (listType === 'watchingList') {
                    message = this.state.title + ' will be removed from your watching-list!';
                } else {
                    message = this.state.title + ' will be removed from your watched-list!';
                }

                Alert.alert('Are you sure?', message,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => {
                                db.removeFromList({
                                    listType,
                                    titleId: this.state.titleId,
                                    titleName: this.state.title,
                                    titleOverview: this.state.overview,
                                    titleVoteCount: this.state.voteCount,
                                    titleVoteAverage: this.state.voteAverage,
                                    titlePosterPath: this.state.posterPath,
                                    titleType: 'show',
                                    uuid: this.state.uuid,
                                })
                                    .then(result => {
                                        this.initButtons(this.state.username, this.state.uuid, this.state.titleId);
                                    }, error => {
                                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                                    });
                            },
                        },
                    ]
                );
            }
        };

        this.displayAlreadyInList = (listType, title) => {
            CustomSnackbar.showSnackBar(title + ' is already in your ' + listType + '-list!', 'short', '#e74c3c', null);
        };

        this.getRecommendations = () => {
            netCon.checkNetCon()
                .then(success => {
                    // Internet connection available
                    if (this.state.titleId === '' || this.state.title === '') {
                        // Show has not been loaded yet
                        Alert.alert('Oops', 'Please try again!');
                    } else {
                        this.props.navigation.navigate('RecommendationsScreen', {
                            username: this.state.username,
                            uuid: this.state.uuid,
                            titleId: this.state.titleId,
                            title: this.state.title,
                            recomType: 'show',
                        });
                    }
                }, error => {
                    // Internet connection unavailable
                    CustomSnackbar.showSnackBar('An internet connection is required!', 'always', '#e74c3c', 'OK');
                });
        };

        this.initScreen = () => {
            let lowResPosterPath = `https://image.tmdb.org/t/p/w185/${this.state.posterPath}`;
            let fabJsx =
                <ActionButton
                    buttonColor="#913d88"
                    position="right"
                    style={styles.fab}
                    shadowStyle={styles.fabShadow}
                    renderIcon={() => (<MaterialCommunityIcons name="lightbulb-on-outline" style={styles.actionButtonIcon} size={22} />)}
                    onPress={() => this.getRecommendations()} />;

            let posterJsx = this.noPoster === false ?
                <View>
                    <ImageBackground source={{ uri: lowResPosterPath }}
                        blurRadius={8} style={styles.containerPoster}
                        resizeMode="cover">
                        <Image source={{ uri: this.state.originalPosterPath }}
                            style={styles.originalPoster}
                            resizeMode="contain" />
                    </ImageBackground>
                    {fabJsx}
                </View>
                : null;

            let createdByJsx = this.state.createdBy.length !== 0 ?
                <Text style={styles.createdBy}>
                    Created by
                {' ' + this.state.createdBy.join(', ')}
                </Text> : null;

            let genresJsx = this.state.genres.length !== 0 ?
                <View style={styles.detailsContentWrapper}>
                    <Text style={styles.detailsTitle}>Genres</Text>
                    <Text style={styles.runtime}>{this.state.genres.join(', ')}</Text>
                </View> : null;

            let networksJsx = this.state.networks.length !== 0 ?
                <View style={styles.detailsContentWrapper}>
                    <Text style={styles.detailsTitle}>Networks</Text>
                    <Text style={styles.runtime}>{this.state.networks.join(', ')}</Text>
                </View> : null;

            let firstAirDateJsx = this.state.firstAirDate !== '' ?
                <View style={styles.detailsContentWrapper}>
                    <Text style={styles.detailsTitle}>First aired on</Text>
                    <Text style={styles.runtime}>
                        {this.monthNames[new Date(this.state.firstAirDate).getMonth()]}
                        {' ' + this.state.firstAirDate.slice(-2)}, {' ' + this.state.firstAirDate.slice(0, 4)}
                    </Text>
                </View> : null;

            let lastAirDateJsx = this.state.lastAirDate !== '' ?
                <View style={styles.detailsContentWrapper}>
                    <Text style={styles.detailsTitle}>Last aired on</Text>
                    <Text style={styles.runtime}>
                        {this.monthNames[new Date(this.state.lastAirDate).getMonth()]}
                        {' ' + this.state.lastAirDate.slice(-2)}, {' ' + this.state.lastAirDate.slice(0, 4)}
                    </Text>
                </View> : null;

            let detailsJsx =
                <View style={styles.detailsWrapper}>
                    {genresJsx}
                    {networksJsx}
                    <View style={styles.airDateWrapper}>
                        {firstAirDateJsx}
                        {lastAirDateJsx}
                    </View>
                    {this.state.wishListBtnJsx}
                    {this.state.watchingListBtnJsx}
                    {this.state.watchedListBtnJsx}
                </View>;

            let overviewJsx = this.state.overview !== null ?
                <Text style={styles.overview}>{this.state.overview}</Text>
                : null;

            let backdropPathJsx = this.noBackdrop === null ?
                <Image source={{ uri: this.state.backdropPath }}
                    style={styles.backdropPath}
                    resizeMode="contain" /> : null;

            let seasonsJsx = [];

            if (this.state.seasons[0] === 'Specials') {
                for (let i = 0; i < this.state.seasons.length; i++) {
                    seasonsJsx.push(
                        <TouchableOpacity style={styles.seasonWrapper}
                            onPress={() => this.onSeasonSelected(i, this.state.seasons[i])}>
                            <Text style={styles.seasonTitle}>{this.state.seasons[i]}</Text>
                            <Icon name="angle-right" size={20} color="#19b5fe" style={styles.rightIcon} />
                        </TouchableOpacity>
                    );
                }
            } else {
                for (let i = 1; i <= this.state.seasons.length; i++) {
                    seasonsJsx.push(
                        <TouchableOpacity style={styles.seasonWrapper}
                            onPress={() => this.onSeasonSelected(i, this.state.seasons[i - 1])}>
                            <Text style={styles.seasonTitle}>{this.state.seasons[i - 1]}</Text>
                            <Icon name="angle-right" size={20} color="#19b5fe" style={styles.rightIcon} />
                        </TouchableOpacity>
                    );
                }
            }

            let contentWithoutPosterJsx =
                <View style={styles.contentWithoutPoster}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    {createdByJsx}
                    <View style={styles.voteWrapper}>
                        <Text style={styles.text}>{this.state.voteAverage}</Text>
                        <Icon name="heart" size={15} color="#db0a5b" style={styles.heartIcon} />
                        <Text style={styles.text}>by {this.state.voteCount} {this.state.voteCount > 1 ? 'people' : 'person'}</Text>
                    </View>
                    {detailsJsx}
                    {overviewJsx}
                    {backdropPathJsx}
                    {seasonsJsx}
                </View>;

            let contentJsx =
                <View>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.container}>
                            {posterJsx}
                            {contentWithoutPosterJsx}
                        </View>
                    </ScrollView>
                </View>;
            this.setState({ contentJsx }, () => {console.warn('Content set!')});
        };

        this.fetchShowDetails = (titleId) => {
            return new Promise((resolve, reject) => {
                if (titleId !== 'null') {
                    this.setState({
                        contentJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
                    }, () => {
                        fetch(`https://api-cine-digest.herokuapp.com/api/v1/gets/${titleId}`)
                            .then(response => response.json())
                            .then(jsonResponse => {
                                // Parse Genres from array of JSON
                                let genres = [];
                                for (let i = 0; i < jsonResponse.genres.length; i++) { genres[i] = jsonResponse.genres[i].name; }
                                this.noBackdrop = jsonResponse.backdrop_path !== null ? false : true;
                                this.noPoster = jsonResponse.poster_path !== null ? false : true;
                                this.setState({
                                    titleId: jsonResponse.id,
                                    title: jsonResponse.name,
                                    backdropPath: `https://image.tmdb.org/t/p/original/${jsonResponse.backdrop_path}`,
                                    createdBy: jsonResponse.createdBy,
                                    voteAverage: jsonResponse.vote_average,
                                    voteCount: jsonResponse.vote_count,
                                    seasons: jsonResponse.seasons,
                                    episodeRuntime: jsonResponse.episodeRunTime,
                                    status: jsonResponse.status,
                                    firstAirDate: jsonResponse.first_air_date,
                                    lastAirDate: jsonResponse.last_air_date,
                                    nextEpisodeToAir: jsonResponse.next_episode_to_air,
                                    genres: genres,
                                    networks: jsonResponse.networks,
                                    numberOfEpisodes: jsonResponse.number_of_episodes,
                                    overview: jsonResponse.overview,
                                    posterPath: jsonResponse.poster_path,
                                    originalPosterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
                                });
                                this.initScreen()
                                    .then(() => resolve(true))
                                    .catch(error => reject(error));
                            })
                            .catch(error => {
                                reject(false);
                            });
                    });
                }
            });
        };
    }

    willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
            console.debug('willFocus', payload);
            this.setState({
                contentJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
            });
        }
    );

    didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
            console.debug('didFocus', payload);
            let titleId = this.props.navigation.getParam('titleId', null);
            console.warn('DID FOCUS titleID: ' + titleId);
            this.setState({ titleId }, () => {
                console.warn('Added to state: ' + this.state.titleId);
                this.getUserId()
                    .then(() => {
                        this.fetchShowDetails(titleId)
                            .catch(error => console.warn(error));
                    })
                    .catch(error => console.warn(error.message));
            });
        }
    );

    onSeasonSelected = (seasonNo, seasonName) => {
        netCon.checkNetCon()
            .then((result) => {
                this.props.navigation.navigate('SeasonDetailsScreen',
                    {
                        showName: this.state.title,
                        titleId: this.state.titleId,
                        seasonNo,
                        seasonName,
                    });
            }, (error) => {
                netCon.showSnackBar('An internet connection is required!');
            });
    }

    render() {
        return (
            <ImageBackground blurRadius={2}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                {this.state.contentJsx}
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
    contentWithoutPoster: {
        padding: 25,
        minWidth: '95%',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    containerPoster: {
        width: '100%',
        height: 400,
    },
    originalPoster: {
        width: 400,
        height: 400,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    createdBy: {
        fontStyle :'italic',
        marginBottom: 15,
        fontSize: 15,
    },
    genres: {
        marginBottom: 15,
        fontSize: 15,
        textAlign: 'justify',
    },
    networks: {
        marginBottom: 15,
        fontSize: 15,
        textAlign: 'justify',
    },
    wishListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
		borderRadius: 50,
		padding: 15,
        width: '80%',
        marginBottom: 10,
        backgroundColor: '#019875',
    },
    watchingListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '80%',
        backgroundColor: '#f27935',
        marginBottom: 10,
    },
    watchedListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
		borderRadius: 50,
		padding: 15,
        width: '80%',
        backgroundColor: '#22a7f0',
        marginBottom: 10,
    },
    removeFromListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '80%',
        marginBottom: 10,
        backgroundColor: '#e74c3c',
    },
    btnText: {
        color: '#fff',
    },
    disabledBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '80%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#6c7a89',
    },
    disabledBtnText: {
        color: '#6c7a89',
    },
    airDateWrapper: {
        marginBottom: 15,
    },
    airDate: {
        fontSize: 15,
        textAlign: 'justify',
        marginBottom: 15,
    },
    detailsWrapper: {
        backgroundColor: 'rgba(218, 223, 225, 0.2)',
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
    },
    detailsContentWrapper: {
        flexDirection: 'row',
        width: '80%',
        marginBottom: 10,
    },
    detailsTitle: {
        color: '#913d88',
        marginBottom: 15,
        marginRight: 15,
        fontSize: 15,
    },
    voteWrapper: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        flex: 2,
        marginBottom: 20,
    },
    heartIcon: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 3,
    },
    overview: {
        marginTop: 10,
        marginBottom: 15,
        fontSize: 15,
        textAlign: 'justify',
    },
    backdropPath: {
        width: 380,
        height: 200,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 50,
    },
    text: {
        fontSize: 15,
    },
    seasonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderWidth: 0.2,
        borderRadius: 50,
        padding: 20,
        marginBottom: 10,
    },
    rightIcon: {
        flex: 1,
    },
    seasonTitle: {
        fontSize: 15,
        flex: 9,
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
        color: 'white',
    },
    indicator: {
        flex: 1,
        alignSelf: 'center',
        margin: 20,
    },
});
