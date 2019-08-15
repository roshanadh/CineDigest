import React, {Component} from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class MovieDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('screenName', 'Movie Details'),
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
        };
        this.noBackdrop = false;
        this.noPoster = false;

        this.getUsername = () => {
            let username = this.props.navigation.getParam('username', null);
            this.setState({ username });
        };

        this.addToWishList = () => {
            alert("Added to Wish List, senyor " + this.state.username);
        };

        this.addToWatchedList = () => {
            alert("Added to Watched List, senyor " + this.state.username);
        };
    }

    componentDidMount() {
        this.getUsername();
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

    render() {
        this.titleId = this.props.navigation.getParam('titleId', 'null');
        this.fetchMovieDetails(this.titleId);
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
                <Text style={styles.text}>
                    {this.state.credits.join(' | ')}
                </Text>
            </View> : null;
        return (
            <ImageBackground blurRadius={1.3}
                source={require('../assets/lilypads.png')}
                resizeMode="cover" style={styles.bgImage}>
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
                        <TouchableOpacity style={styles.wishListBtn}
                            onPress={this.addToWishList}>
                            <Text>Add to Wish-list</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.watchedListBtn}
                            onPress={this.addToWatchedList}>
                            <Text>Add to Watched-list</Text></TouchableOpacity>
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
        margin: 10,
        padding: 25,
        backgroundColor: '#fefefa',
        borderRadius: 15,
        minWidth: '95%',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        fontSize: 19,
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
        backgroundColor: '#7befb2',
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
    }
});
