import React, {Component} from 'react';
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
import FABIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';

import db from '../db/db';

export default class MovieDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('screenName', 'Movie Details'),
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#6bb9f0',
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
        };
        this.noBackdrop = false;
        this.noPoster = false;

        this.initButtons = (username, titleId) => {
            return new Promise((resolve, reject) => {
                // Check if movie is in Wish-list
                db.isInList('wishList', this.titleId, username, 'movie')
                    .then(result => {
                        // Movie is already in Wish-list
                        this.setState({
                            wishListBtnJsx:
                                <TouchableOpacity style={styles.removeFromWishListBtn}
                                    onPress={() => this.removeFromList('wishList')}>
                                    <Text style={styles.btnText}>Remove from Wish-list</Text>
                                </TouchableOpacity>,
                            // If movie is in Wish-list, it cannot be already in Watched-list
                            watchedListBtnJsx:
                                <TouchableOpacity style={styles.watchedListBtn}
                                    onPress={() => this.addToWatchedList()}>
                                    <Text style={styles.btnText}>Add to Watched-list</Text>
                                </TouchableOpacity>,
                        });
                    }, error => {
                        // Movie is not in Wish-list
                        // Check if it is in Watched-list
                        db.isInList('watchedList', this.titleId, username, 'movie')
                            .then(result => {
                                // Movie is in Wish-list
                                this.setState({
                                    wishListBtnJsx:
                                        <TouchableOpacity style={styles.wishListBtn}
                                            onPress={() => this.displayAlreadyInList('watched', this.state.title)}>
                                            <Text style={styles.btnText}>Add to Wish-list</Text>
                                        </TouchableOpacity>,
                                    watchedListBtnJsx:
                                        <TouchableOpacity style = { styles.removeFromWatchedListBtn }
                                            onPress = { () => this.removeFromList('watchedList') } >
                                            <Text style={styles.btnText}>Remove from Watched-list</Text>
                                        </TouchableOpacity >,
                                });
                            }, error => {
                                // Movie is not in Watched-list
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
                    username: this.state.username,
                })
                    .then(result => {
                        let message = '';
                        // Re-render this Screen
                        message = listType === 'wishList' ? this.state.title + ' has been removed from your wish-list!' :
                            this.state.title + ' has been removed from your watched-list!';
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

        this.getRecommendations = () => {
            if (this.state.titleId === '' || this.state.title === '') {
                // Movie has not been loaded yet
                Alert.alert('Oops', 'Please try again!');
            } else {
                this.props.navigation.navigate('RecommendationsScreen', {
                    username: this.state.username,
                    titleId: this.state.titleId,
                    title: this.state.title,
                    recomType: 'movie',
                });
            }
        };
    }

    fetchMovieDetails = (titleId) => {
        if (this.titleId !== 'null') {
            fetch(`https://api-cine-digest.herokuapp.com/api/v1/getm/${titleId}`)
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
                        title: jsonResponse.title,
                        tagline: jsonResponse.tagline,
                        voteAverage: jsonResponse.vote_average,
                        voteCount: jsonResponse.vote_count,
                        runtime: jsonResponse.runtime,
                        status: jsonResponse.status,
                        genres: genres,
                        credits: jsonResponse.credits,
                        creditsProfilePath: `https://image.tmdb.org/t/p/original/${jsonResponse.creditsProfilePath}`,
                        backdropPath: `https://image.tmdb.org/t/p/original/${jsonResponse.backdrop_path}`,
                        originalLanguage: jsonResponse.original_language,
                        overview: jsonResponse.overview,
                        posterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
                        releaseDate: jsonResponse.release_date,
                    });
                }) // TODO fix response status parsing
                .catch(error => {
                    // alert('Oops!\nPlease make sure your search query is correct!');
                });
        }
    }

    componentDidMount() {
        this.titleId = this.props.navigation.getParam('titleId', 'null');
        this.fetchMovieDetails(this.titleId);
        this.getUsername();
    }

    render() {
        this.titleId = this.props.navigation.getParam('titleId', 'null');
        this.fetchMovieDetails(this.titleId);

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
                onPress={() => this.getRecommendations()} />;

        let posterJsx = this.noPoster === false ?
            <Image source={{uri: this.state.posterPath}}
                style={styles.posterPath}
                resizeMode="contain"/> : null;
        let taglineJsx = this.state.tagline !== null ?
            <Text style={styles.tagline}>{this.state.tagline}</Text>
            : null;
        let genresJsx = this.state.genres.length !== 0 ?
            <Text style={styles.genres}>
                Genres:
                {' ' + this.state.genres.join(' | ')}
            </Text> : null;
        let releaseDateJsx = this.state.releaseDate !== null ?
            ( new Date(this.state.releaseDate) > new Date() ?
            <Text style={styles.releaseDate}>
                Releases
                {' ' + this.monthNames[new Date(this.state.releaseDate).getMonth()]}
                {' ' + this.state.releaseDate.slice(-2)}, {' ' + this.state.releaseDate.slice(0, 4)}
            </Text> :
            <Text style={styles.releaseDate}>
                Released
                {' ' + this.monthNames[new Date(this.state.releaseDate).getMonth()]}
                {' ' + this.state.releaseDate.slice(-2)}, {' ' + this.state.releaseDate.slice(0, 4)}
            </Text> ) : null;
        let overviewJsx = this.state.overview !== null ?
            <Text style={styles.text}>{this.state.overview}</Text>
            : null;
        let backdropPathJsx = this.noBackdrop === false ?
            <Image source={{uri: this.state.backdropPath}}
                style={styles.backdropPath}
                resizeMode="contain"/> : null;
        let castJsx = this.state.credits.length !== 0 ?
            <View>
                <Text style={styles.castHeader}>Cast</Text>
                <Text style={styles.cast}>
                    {this.state.credits.join(' | ')}
                </Text>
            </View> : null;
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
                        {taglineJsx}
                        {genresJsx}
                        {this.state.wishListBtnJsx}
                        {this.state.watchedListBtnJsx}
                        {releaseDateJsx}
                        {overviewJsx}
                        {backdropPathJsx}
                        {castJsx}
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
    tagline: {
        fontStyle :'italic',
        marginBottom: 15,
        fontSize: 15,
    },
    genres: {
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
    removeFromWishListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '70%',
        marginBottom: 10,
        backgroundColor: '#e74c3c',
    },
    removeFromWatchedListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        padding: 15,
        width: '70%',
        backgroundColor: '#e74c3c',
        marginBottom: 30,
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
        width: '70%',
        backgroundColor: '#22a7f0',
        marginBottom: 30,
    },
    releaseDate: {
        marginBottom: 15,
        fontSize: 15,
        textAlign: 'justify',
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
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    fab: {
        zIndex: 1,
        marginBottom: 50,
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
