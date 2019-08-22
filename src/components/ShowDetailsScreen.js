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
import FABIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';

import db from '../db/db';
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
                backgroundColor: '#6bb9f0',
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
            wishListBtnJsx: <ActivityIndicator size="small" color="#22a7f0" style={styles.indicator} />,
            watchingListBtnJsx: <ActivityIndicator size="small" color="#22a7f0" style={styles.indicator} />,
            watchedListBtnJsx: <ActivityIndicator size="small" color="#22a7f0" style={styles.indicator} />,
        };
        this.noBackdrop = false;
        this.noPoster = false;

        this.initButtons = (username, titleId) => {
            return new Promise((resolve, reject) => {
                // Check if show is in Wish-list
                db.isInList('wishList', this.titleId, username, 'show')
                    .then(result => {
                        // Show is already in Wish-list
                        this.setState({
                            wishListBtnJsx:
                                <TouchableOpacity style={styles.removeFromListBtn}
                                    onPress={() => this.removeFromList('wishList')}>
                                    <Text style={styles.btnText}>Remove from Wish-list</Text>
                                </TouchableOpacity>,
                            // If show is in Wish-list, it cannot be already in
                            // Watched-list or Watching-list
                            watchingListBtnJsx:
                                <TouchableOpacity style={styles.watchingListBtn}
                                    onPress={() => this.addToWatchingList()}>
                                    <Text style={styles.btnText}>Add to Watching-list</Text>
                                </TouchableOpacity>,
                            watchedListBtnJsx:
                                <TouchableOpacity style={styles.watchedListBtn}
                                    onPress={() => this.addToWatchedList()}>
                                    <Text style={styles.btnText}>Add to Watched-list</Text>
                                </TouchableOpacity>,
                        });
                    }, error => {
                        // Show is not in Wish-list
                        // Check if it is in Watching-list
                        db.isInList('watchingList', this.titleId, username, 'show')
                            .then(result => {
                                // Show is in Watching-list
                                // Add to Wish-list btn is disabled,
                                // Remove from Watching-list, and
                                // Add to Watched-list buttons are present
                                this.setState({
                                    wishListBtnJsx:
                                        <TouchableOpacity style={styles.wishListBtn}
                                            onPress={() => this.displayAlreadyInList('watching', this.state.title)}>
                                            <Text style={styles.btnText}>Add to Wish-list</Text>
                                        </TouchableOpacity>,
                                    watchingListBtnJsx:
                                        <TouchableOpacity style={styles.removeFromListBtn}
                                            onPress={() => this.removeFromList('watchingList')}>
                                            <Text style={styles.btnText}>Remove from Watching-list</Text>
                                        </TouchableOpacity>,
                                    watchedListBtnJsx:
                                        <TouchableOpacity style={styles.watchedListBtn}
                                            onPress={() => this.addToWatchedList()} >
                                            <Text style={styles.btnText}>Add to Watched-list</Text>
                                        </TouchableOpacity >,
                                });
                            }, error => {
                                // Show is not in Watching-list
                                // Check if it is in Watched-list
                                    db.isInList('watchedList', this.titleId, username, 'show')
                                        .then(result => {
                                            // Show is in Watched-list
                                            // Add to Wish-list and
                                            // Add to Watching-list buttons are disabled,
                                            // Remove from Watched-list button is present
                                            this.setState({
                                                wishListBtnJsx:
                                                    <TouchableOpacity style={styles.wishListBtn}
                                                        onPress={() => this.displayAlreadyInList('watched', this.state.title)}>
                                                        <Text style={styles.btnText}>Add to Wish-list</Text>
                                                    </TouchableOpacity>,
                                                watchingListBtnJsx:
                                                    <TouchableOpacity style={styles.watchingListBtn}
                                                        onPress={() => this.displayAlreadyInList('watched', this.state.title)}>
                                                        <Text style={styles.btnText}>Add to Watching-list</Text>
                                                    </TouchableOpacity>,
                                                watchedListBtnJsx:
                                                    <TouchableOpacity style={styles.removeFromListBtn}
                                                        onPress={() => this.removeFromList('watchedList')}>
                                                        <Text style={styles.btnText}>Remove from Watched-list</Text>
                                                    </TouchableOpacity>,
                                            });
                                        }, error => {
                                            // Show is not in Watched-list either
                                            // Display all addToList buttons normally
                                                this.setState({
                                                    wishListBtnJsx:
                                                        <TouchableOpacity style={styles.wishListBtn}
                                                            onPress={() => this.addToWishList()}>
                                                            <Text style={styles.btnText}>Add to Wish-list</Text>
                                                        </TouchableOpacity>,
                                                    watchingListBtnJsx:
                                                        <TouchableOpacity style={styles.watchingListBtn}
                                                            onPress={() => this.addToWatchingList()}>
                                                            <Text style={styles.btnText}>Add to Watching-list</Text>
                                                        </TouchableOpacity>,
                                                    watchedListBtnJsx:
                                                        <TouchableOpacity style={styles.watchedListBtn}
                                                            onPress={() => this.addToWatchedList()} >
                                                            <Text style={styles.btnText}>Add to Watched-list</Text>
                                                        </TouchableOpacity >,
                                                });
                                        });
                                    });
                            });
                    });
        };

        this.getUsername = () => {
            return new Promise((resolve, reject) => {
                let username = this.props.navigation.getParam('username', null);
                this.setState({ username });
                this.initButtons(username, this.titleId);
            });
        };

        this.addToWishList = () => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                db.addShowToWishList({
                    listType: 'wishList',
                    titleId: this.state.titleId,
                    titleName: this.state.title,
                    titleOverview: this.state.overview,
                    titleVoteCount: this.state.voteCount,
                    titleVoteAverage: this.state.voteAverage,
                    titlePosterPath: this.state.posterPath,
                    titleType: 'show',
                    username: this.state.username,
                })
                    .then(result => {
                        Alert.alert('Success', this.state.title + ' has been added to your wish-list!',
                            [{
                                text: 'OK',
                                onPress: () => this.initButtons(this.state.username, this.titleId),
                            }]
                        );
                    }, error => {
                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                    });
            }
        };

        this.addToWatchingList = () => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                db.addShowToWatchingList({
                    listType: 'watchingList',
                    titleId: this.state.titleId,
                    titleName: this.state.title,
                    titleOverview: this.state.overview,
                    titleVoteCount: this.state.voteCount,
                    titleVoteAverage: this.state.voteAverage,
                    titlePosterPath: this.state.posterPath,
                    titleType: 'show',
                    username: this.state.username,
                })
                    .then(result => {
                        Alert.alert('Success', this.state.title + ' has been added to your watching-list!',
                            [{
                                text: 'OK',
                                onPress: () => this.initButtons(this.state.username, this.titleId),
                            }]
                        );
                    }, error => {
                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                    });
            }
        };

        this.addToWatchedList = () => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                db.addShowToWatchedList({
                    listType: 'watchedList',
                    titleId: this.state.titleId,
                    titleName: this.state.title,
                    titleOverview: this.state.overview,
                    titleVoteCount: this.state.voteCount,
                    titleVoteAverage: this.state.voteAverage,
                    titlePosterPath: this.state.posterPath,
                    titleType: 'show',
                    username: this.state.username,
                })
                    .then(result => {
                        Alert.alert('Success', this.state.title + ' has been added to your watched-list!',
                            [{
                                text: 'OK',
                                onPress: () => this.initButtons(this.state.username, this.titleId),
                            }]
                        );
                    }, error => {
                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                    });
            }
        };


        this.removeFromList = (listType) => {
            if (this.state.titleId === '') {
                // Show has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                db.removeFromList({
                    listType,
                    titleId: this.state.titleId,
                    titleName: this.state.title,
                    titleOverview: this.state.overview,
                    titleVoteCount: this.state.voteCount,
                    titleVoteAverage: this.state.voteAverage,
                    titlePosterPath: this.state.posterPath,
                    titleType: 'show',
                    username: this.state.username,
                })
                    .then(result => {
                        let message = '';
                        // Re-render this Screen
                        if (listType === 'wishList') {
                            message = this.state.title + ' has been removed from your wish-list!';
                        } else if (listType === 'watchingList') {
                            message = this.state.title + ' has been removed from your watching-list!';
                        } else {
                            message = this.state.title + ' has been removed from your watched-list!';
                        }

                        Alert.alert('Success', message,
                            [{
                                text: 'OK',
                                onPress: () => this.initButtons(this.state.username, this.titleId),
                            }]
                        );
                    }, error => {
                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                    });
            }
        };

        this.displayAlreadyInList = (listType, title) => {
            Alert.alert('Error', title + ' is already in your ' + listType + '-list!');
        };
    }

    componentDidMount() {
        this.titleId = this.props.navigation.getParam('titleId', 'null');
        this.fetchShowDetails(this.titleId);
        this.getUsername();
    }
    fetchShowDetails = (titleId) => {
        if (this.titleId !== 'null') {
            fetch(`https://api-cine-digest.herokuapp.com/api/v1/gets/${titleId}`)
                .then(response => response.json())
                .then(jsonResponse => { // TODO read full response, not just titles
                    // Parse Genres from array of JSON
                    let genres = [];
                    for (let i = 0; i < jsonResponse.genres.length; i++)
                        {genres[i] = jsonResponse.genres[i].name;}
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
                        posterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
                    });
                }) // TODO fix response status parsing
                .catch(error => {
                    // alert('Oops!\nPlease make sure your search query is correct!');
                });
        }
    }

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
        this.titleId = this.props.navigation.getParam('titleId', 'null');
        this.fetchShowDetails(this.titleId);

        let fabJsx =
            <ActionButton
                buttonColor="#db0a5b"
                position="right"
                style={styles.fab}
                renderIcon={
                    active => active ?
                        (<FABIcon name="lightbulb-on" style={styles.actionButtonIconOn} />)
                        : (<FABIcon name="lightbulb-on" style={styles.actionButtonIconOff} />)
                }
                onPress={() => alert('Oh yes!')} />;

        let posterJsx = this.noPoster === false ?
            <Image source={{uri: this.state.posterPath}}
                style={styles.posterPath}
                resizeMode="contain"/> : null;

        let createdByJsx = this.state.createdBy.length !== 0 ?
            <Text style={styles.createdBy}>
                Created by
                {' ' + this.state.createdBy.join(' | ')}
            </Text> : null;

        let genresJsx = this.state.genres.length !== 0 ?
            <Text style={styles.genres}>
                Genres:
                {' ' + this.state.genres.join(' | ')}
            </Text> : null;

        let networksJsx = this.state.networks.length !== 0 ?
            <Text style={styles.networks}>
                Networks:
                {' ' + this.state.networks.join(' | ')}
            </Text> : null;

        let firstAirDateJsx = this.state.firstAirDate !== null ?
            <Text style={styles.airDate}>
                First aired on
                {' ' + this.monthNames[new Date(this.state.firstAirDate).getMonth()]}
                {' ' + this.state.firstAirDate.slice(-2)}, {' ' + this.state.firstAirDate.slice(0, 4)}
            </Text> : null;

        let lastAirDateJsx = this.state.lastAirDate !== null ?
            <Text style={styles.airDate}>
                Last aired on
                {' ' + this.monthNames[new Date(this.state.lastAirDate).getMonth()]}
                {' ' + this.state.lastAirDate.slice(-2)}, {' ' + this.state.lastAirDate.slice(0, 4)}
            </Text> : null;

        let overviewJsx = this.state.overview !== null ?
            <Text style={styles.overview}>{this.state.overview}</Text>
            : null;

        let backdropPathJsx = this.noBackdrop === null ?
            <Image source={{uri: this.state.backdropPath}}
                style={styles.backdropPath}
                resizeMode="contain"/> : null;

        let seasonsJsx = [];

        if (this.state.seasons[0] === 'Specials') {
            for (let i = 0; i < this.state.seasons.length; i++) {
                seasonsJsx.push(
                    <TouchableOpacity style={styles.seasonWrapper}
                        onPress={() => this.onSeasonSelected(i, this.state.seasons[i])}>
                        <Text style={styles.seasonTitle}>{this.state.seasons[i]}</Text>
                        <Icon name="angle-right" size={20} color="#19b5fe" style={styles.rightIcon}/>
                    </TouchableOpacity>
                );
            }
        } else {
            for (let i = 1; i <= this.state.seasons.length; i++) {
                seasonsJsx.push(
                    <TouchableOpacity style={styles.seasonWrapper}
                        onPress={() => this.onSeasonSelected(i, this.state.seasons[i - 1])}>
                        <Text style={styles.seasonTitle}>{this.state.seasons[i - 1]}</Text>
                        <Icon name="angle-right" size={20} color="#19b5fe" style={styles.rightIcon}/>
                    </TouchableOpacity>
                );
            }
        }

        return (
            <ImageBackground blurRadius={1.5}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
                {fabJsx}
                <ScrollView style={styles.scrollView}>
                    <View style={styles.container}>
                        {posterJsx}
                        <Text style={styles.title}>{this.state.title}</Text>
                        <View style={styles.voteWrapper}>
                            <Text style={styles.text}>{this.state.voteAverage}</Text>
                            <Icon name="heart" size={15} color="#db0a5b" style={styles.heartIcon}/>
                            <Text style={styles.text}>by {this.state.voteCount} {this.state.voteCount > 1 ? 'people' : 'person'}</Text>
                        </View>
                        {createdByJsx}
                        {genresJsx}
                        {networksJsx}
                        {this.state.wishListBtnJsx}
                        {this.state.watchingListBtnJsx}
                        {this.state.watchedListBtnJsx}
                        <View style={styles.airDateWrapper}>
                            {firstAirDateJsx}
                            {lastAirDateJsx}
                        </View>
                        {overviewJsx}
                        {backdropPathJsx}
                        {seasonsJsx}
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
        padding: 25,
        minWidth: '95%',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    posterPath: {
        width: 400,
        height: 400,
        alignSelf: 'center',
        borderRadius: 5,
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
        marginBottom: 30,
        fontSize: 15,
        textAlign: 'justify',
    },
    wishListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
		borderRadius: 50,
		padding: 15,
        width: '70%',
        marginBottom: 10,
        backgroundColor: '#019875',
    },
    watchingListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '70%',
        backgroundColor: '#8e44ad',
        marginBottom: 10,
    },
    watchedListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
		borderRadius: 50,
		padding: 15,
        width: '70%',
        backgroundColor: '#22a7f0',
        marginBottom: 30,
    },
    removeFromListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '70%',
        marginBottom: 10,
        backgroundColor: '#e74c3c',
    },
    btnText: {
        color: '#fefefe',
    },
    airDateWrapper: {
        marginTop: 10,
        marginBottom: 15,
    },
    airDate: {
        fontSize: 15,
        textAlign: 'justify',
        marginBottom: 10,
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
        marginBottom: 50,
    },
    actionButtonIconOn: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    actionButtonIconOff: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});
