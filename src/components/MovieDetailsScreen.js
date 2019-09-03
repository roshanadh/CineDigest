import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Alert,
    ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';

import db from '../db/db_exp';

export default class MovieDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('screenName', 'Movie Details'),
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#913d88',
                elevation: 0,
            },
        };
    };

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
            tagline: '',
            voteCount: '',
            voteAverage: '',
            runtime: '',
            status: '',
            genres: [],
            credits: [],
            creditsProfilePath: [],
            directors: [],
            directorsProfilePath: [],
            backdropPath: '',
            budget: '',
            revenue: '',
            homepage: '',
            originalLanguage: '',
            overview: '',
            posterPath: '',
            releaseDate: '',
            wishListBtnJsx: <ActivityIndicator size="small" color="#22a7f0" style={styles.indicator} />,
            watchedListBtnJsx: <ActivityIndicator size="small" color="#22a7f0" style={styles.indicator} />,
            contentJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
        };
        this.noBackdrop = false;
        this.noPoster = false;

        this.initButtons = (username, uuid, titleId) => {
            console.warn('OK initButtons init! ' + username + ' ' + titleId);
            return new Promise((resolve, reject) => {
                this.setState({
                    wishListBtnJsx: <ActivityIndicator size="small" color="#22a7f0" style={styles.indicator} />,
                    watchedListBtnJsx: <ActivityIndicator size="small" color="#22a7f0" style={styles.indicator} />,
                    contentJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
                },);
                // Check if movie is in Wish-list
                db.isInList('wishList', titleId, uuid, 'movie')
                    .then(result => {
                        // Movie is already in Wish-list
                        console.warn(`Movie ${titleId} is already in wish list`);
                        this.setState({
                            wishListBtnJsx:
                                <TouchableOpacity style={styles.removeFromListBtn}
                                    onPress={() => this.removeFromList('wishList')}>
                                    <Text style={styles.btnText}>Remove from Wish-list</Text>
                                </TouchableOpacity>,
                            // If movie is in Wish-list, it cannot be already in Watched-list
                            watchedListBtnJsx:
                                <TouchableOpacity style={styles.watchedListBtn}
                                    onPress={() => this.addToWatchedList()}>
                                    <Text style={styles.btnText}>Add to Watched-list</Text>
                                </TouchableOpacity>,
                        }, () =>
                        {
                            this.initScreen();
                            resolve(true);
                        });
                    }, error => {
                        // Movie is not in Wish-list
                        // Check if it is in Watched-list
                        db.isInList('watchedList', titleId, uuid, 'movie')
                            .then(result => {
                                // Movie is in Watched-list
                                console.warn(`Movie ${titleId} is already in watched list`);
                                this.setState({
                                    wishListBtnJsx:
                                        <TouchableOpacity style={styles.disabledBtn}
                                            onPress={() => this.displayAlreadyInList('watched', this.state.title)}>
                                            <Text style={styles.disabledBtnText}>Add to Wish-list</Text>
                                        </TouchableOpacity>,
                                    watchedListBtnJsx:
                                        <TouchableOpacity style={styles.removeFromListBtn}
                                            onPress={() => this.removeFromList('watchedList')} >
                                            <Text style={styles.btnText}>Remove from Watched-list</Text>
                                        </TouchableOpacity >,
                                }, () =>
                                {
                                    this.initScreen();
                                    resolve(true);
                                });
                            }, error => {
                                // Movie is not in Watched-list
                                    console.warn(`Movie ${titleId} is not in a list`);
                                this.setState({
                                    wishListBtnJsx:
                                        <TouchableOpacity style={styles.wishListBtn}
                                            onPress={() => this.addToWishList()}>
                                            <Text style={styles.btnText}>Add to Wish-list</Text>
                                        </TouchableOpacity>,
                                    watchedListBtnJsx:
                                        <TouchableOpacity style={styles.watchedListBtn}
                                            onPress={() => this.addToWatchedList()}>
                                            <Text style={styles.btnText}>Add to Watched-list</Text>
                                        </TouchableOpacity>,
                                }, () =>
                                {
                                    this.initScreen();
                                    resolve(true);
                                });
                            })
                            .catch(error => console.warn(error.message));
                    })
                    .catch(error => console.warn(error.message));
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
            console.warn('OK add to wishList init!');
            if (this.state.titleId === '') {
                // Movie has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                db.addMovieToWishList({
                    listType: 'wishList',
                    titleId: this.state.titleId,
                    titleName: this.state.title,
                    titleOverview: this.state.overview,
                    titleVoteCount: this.state.voteCount,
                    titleVoteAverage: this.state.voteAverage,
                    titlePosterPath: this.state.posterPath,
                    titleType: 'movie',
                    uuid: this.state.uuid,
                })
                    .then(result => {
                        console.warn('OK added to wishList! ' + this.state.title);
                        Alert.alert('Success', this.state.title + ' has been added to your wish-list!',
                            [{
                                text: 'OK',
                                onPress: () => this.initButtons(this.state.username, this.state.uuid, this.state.titleId),
                            }]
                        );
                    }, error => {
                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                    })
                    .catch(error => console.warn(error.message));
            }
        };

        this.addToWatchedList = () => {
            if (this.state.titleId === '') {
                // Movie has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                db.addMovieToWatchedList({
                    listType: 'watchedList',
                    titleId: this.state.titleId,
                    titleName: this.state.title,
                    titleOverview: this.state.overview,
                    titleVoteCount: this.state.voteCount,
                    titleVoteAverage: this.state.voteAverage,
                    titlePosterPath: this.state.posterPath,
                    titleType: 'movie',
                    uuid: this.state.uuid,
                })
                    .then(result => {
                        Alert.alert('Success', this.state.title + ' has been added to your watched-list!',
                            [{
                                text: 'OK',
                                onPress: () => this.initButtons(this.state.username, this.state.uuid, this.state.titleId),
                            }]
                        );
                    }, error => {
                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                    })
                    .catch(error => console.warn(error.message));
            }
        };

        this.removeFromList = (listType) => {
            if (this.state.titleId === '') {
                // Movie has not been loaded yet
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
                    titleType: 'movie',
                    uuid: this.state.uuid,
                })
                    .then(result => {
                        let message = '';
                        // Re-render this Screen
                        message = listType === 'wishList' ? this.state.title + ' has been removed from your wish-list!' :
                            this.state.title + ' has been removed from your watched-list!';
                        Alert.alert('Success', message,
                            [{
                                text: 'OK',
                                onPress: () => this.initButtons(this.state.username, this.state.uuid, this.state.titleId),
                            }]
                        );
                    }, error => {
                        Alert.alert('Ooops', 'There was a problem. Please try again later!');
                    })
                    .catch(error => console.warn(error.message));
            }
        };

        this.displayAlreadyInList = (listType, title) => {
            Alert.alert('Error', title + ' is already in your ' + listType + '-list!');
        };

        this.getRecommendations = () => {
            if (this.state.titleId === '' || this.state.title === '') {
                // Movie has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                this.props.navigation.navigate('RecommendationsScreen', {
                    username: this.state.username,
                    uuid: this.state.uuid,
                    titleId: this.state.titleId,
                    title: this.state.title,
                    recomType: 'movie',
                });
            }
        };

        this.initScreen = () => {
            let fabJsx =
                <ActionButton
                    buttonColor="#913d88"
                    position="right"
                    style={styles.fab}
                    shadowStyle={styles.fabShadow}
                    onPress={() => this.getRecommendations()} />;

            let posterJsx = this.noPoster === false ?
                <Image source={{ uri: this.state.posterPath }}
                    style={styles.posterPath}
                    resizeMode="contain" /> : null;

            let taglineJsx = this.state.tagline.trim().length !== 0 ?
                <Text style={styles.tagline}>{this.state.tagline}</Text>
                : null;

            let directorsJsx = this.state.directors.length > 0 ?
                <View style={styles.detailsContentWrapper}>
                    <Text style={styles.detailsTitle}>Directed by</Text>
                    <Text style={styles.directors}>{this.state.directors.join(' | ')}</Text>
                </View> : null;

            let runtimeJsx = this.state.runtime !== null ?
                <View style={styles.detailsContentWrapper}>
                    <Text style={styles.detailsTitle}>Runtime</Text>
                    <Text style={styles.runtime}>{this.state.runtime} minutes</Text>
                </View>
                : null;

            let genresJsx = this.state.genres.length !== 0 ?
                <View style={styles.detailsContentWrapper}>
                    <Text style={styles.detailsTitle}>Genres</Text>
                    <Text style={styles.runtime}>{this.state.genres.join(' | ') }</Text>
                </View> : null;

            let releaseDateJsx = this.state.releaseDate !== '' ?
                (new Date(this.state.releaseDate) > new Date() ?
                    <View style={styles.detailsContentWrapper}>
                        <Text style={styles.detailsTitle}>Releases</Text>
                        <Text style={styles.releaseDate}>
                            {this.monthNames[new Date(this.state.releaseDate).getMonth()]}
                            {' ' + this.state.releaseDate.slice(-2)}, {' ' + this.state.releaseDate.slice(0, 4)}
                        </Text>
                    </View> :
                    <View style={styles.detailsContentWrapper}>
                        <Text style={styles.detailsTitle}>Released</Text>
                        <Text style={styles.releaseDate}>
                            {this.monthNames[new Date(this.state.releaseDate).getMonth()]}
                            {' ' + this.state.releaseDate.slice(-2)}, {' ' + this.state.releaseDate.slice(0, 4)}
                        </Text>
                    </View>
                ) : null;

            let detailsJsx =
                <View style={styles.detailsWrapper}>
                    {directorsJsx}
                    {runtimeJsx}
                    {genresJsx}
                    {releaseDateJsx}
                    {this.state.wishListBtnJsx}
                    {this.state.watchedListBtnJsx}
                </View>;

            let overviewJsx = this.state.overview !== null ?
                <Text style={styles.text}>{this.state.overview}</Text>
                : null;

            let backdropPathJsx = this.noBackdrop === false ?
                <Image source={{ uri: this.state.backdropPath }}
                    style={styles.backdropPath}
                    resizeMode="contain" /> : null;

            let castJsx = this.state.credits.length !== 0 ?
                <View>
                    <Text style={styles.castHeader}>Cast</Text>
                    <Text style={styles.cast}>
                        {this.state.credits.join(' | ')}
                    </Text>
                </View> : null;

            let contentJsx =
                <View>
                    {fabJsx}
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.container}>
                            {posterJsx}
                            <Text style={styles.title}>{this.state.title}</Text>
                            {taglineJsx}
                            <View style={styles.voteWrapper}>
                                <Text style={styles.text}>{this.state.voteAverage}</Text>
                                <Icon name="heart" size={15} color="#db0a5b" style={styles.heartIcon} />
                                <Text style={styles.text}>by {this.state.voteCount} {this.state.voteCount > 1 ? 'people' : 'person'}</Text>
                            </View>
                            {detailsJsx}
                            {overviewJsx}
                            {backdropPathJsx}
                            {castJsx}
                        </View>
                    </ScrollView >
                </View>;
            this.setState({ contentJsx });
        };

        this.fetchMovieDetails = (titleId) => {
            return new Promise((resolve, reject) => {
                if (titleId !== 'null') {
                    this.setState({
                        contentJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
                    }, () => {
                        fetch(`https://api-cine-digest.herokuapp.com/api/v1/getm/${titleId}`)
                            .then(response => response.json())
                            .then(jsonResponse => { // TODO read full response, not just titles
                                // Parse Genres from array of JSON
                                let genres = [];
                                for (let i = 0; i < jsonResponse.genres.length; i++) { genres[i] = jsonResponse.genres[i].name; }
                                this.noBackdrop = jsonResponse.backdrop_path !== null ? false : true;
                                this.noPoster = jsonResponse.poster_path !== null ? false : true;
                                this.setState({
                                    titleId: jsonResponse.id,
                                    title: jsonResponse.title,
                                    tagline: jsonResponse.tagline,
                                    voteAverage: jsonResponse.vote_average,
                                    voteCount: jsonResponse.vote_count,
                                    runtime: jsonResponse.runtime,
                                    status: jsonResponse.status,
                                    genres: genres,
                                    credits: jsonResponse.credits,
                                    creditsProfilePath: `https://image.tmdb.org/t/p/original/${jsonResponse.creditsProfilePath}`,
                                    directors: jsonResponse.directors,
                                    directorsProfilePath: `https://image.tmdb.org/t/p/original/${jsonResponse.directorsProfilePath}`,
                                    backdropPath: `https://image.tmdb.org/t/p/original/${jsonResponse.backdrop_path}`,
                                    originalLanguage: jsonResponse.original_language,
                                    overview: jsonResponse.overview,
                                    posterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
                                    releaseDate: jsonResponse.release_date,
                                });
                                this.initScreen()
                                    .then(() => resolve(true))
                                    .catch(error => reject(error));
                            }) // TODO fix response status parsing
                            .catch(error => {
                                 // alert('Oops!\nPlease make sure your search query is correct!');
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
                contentJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
            });
        }
    );

    didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        payload => {
            console.debug('didFocus', payload);
            let titleId = this.props.navigation.getParam('titleId', null);
            console.warn('DID FOCUS titleID: ' + titleId);
            this.setState({titleId}, () => {
                console.warn('Added to state: ' + this.state.titleId);
                this.getUserId()
                    .then(() => {
                        this.fetchMovieDetails(titleId)
                            .catch(error => console.warn(error));
                    })
                    .catch(error => console.warn(error.message));
            });
        }
    );

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
    tagline: {
        color: '#6c7a89',
        fontStyle: 'italic',
        marginBottom: 15,
        fontSize: 15,
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
    directors: {
        marginBottom: 15,
        fontSize: 15,
    },
    runtime: {
        marginBottom: 15,
        fontSize: 15,
    },
    genres: {
        marginBottom: 15,
        fontSize: 15,
        textAlign: 'justify',
    },
    releaseDate: {
        marginBottom: 15,
        fontSize: 15,
        textAlign: 'justify',
    },
    detailsWrapper: {
        backgroundColor: 'rgba(218, 223, 225, 0.1)',
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
    },
    wishListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '80%',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#019875',
    },
    removeFromListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '80%',
        backgroundColor: '#e74c3c',
        marginBottom: 15,
    },
    btnText: {
        color: '#fefefe',
    },
    watchedListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '80%',
        backgroundColor: '#22a7f0',
        marginBottom: 15,
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
    voteWrapper: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        flex: 2,
    },
    heartIcon: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 3,
    },
    text: {
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
        marginBottom: 30,
    },
    castHeader: {
        color: '#913d88',
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    fab: {
        zIndex: 1,
        marginBottom: 50,
    },
    fabShadow: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(217, 30, 24, 0.1)',
    },
    indicator: {
        flex: 1,
        alignSelf: 'center',
        margin: 20,
    },
    cast: {
        marginBottom: 15,
        fontSize: 15,
        textAlign: 'justify',
    },
});
