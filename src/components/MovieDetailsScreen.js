import React, {Component} from 'react';
import {
    Text,
    Image,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class MovieDetails extends Component {
    constructor(props) {
        super(props);
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        this.state = {
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
                        // Unused
                        // budget: jsonResponse.budget,
                        // revenue: jsonResponse.revenue,
                        // homepage: jsonResponse.homepage,
                        originalLanguage: jsonResponse.original_language,
                        overview: jsonResponse.overview,
                        posterPath: `https://image.tmdb.org/t/p/w185/${jsonResponse.poster_path}`,
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
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Image source={{uri: this.state.posterPath}}
                        style={styles.posterPath}
                        resizeMode="contain"/>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <View style={styles.voteWrapper}>
                        <Text style={styles.text}>{this.state.voteAverage}</Text>
                        <Icon name="heart" size={15} color="#db0a5b" style={styles.heartIcon}/>
                        <Text style={styles.text}>by {this.state.voteCount} {this.state.voteCount > 1 ? 'people' : 'person'}</Text>
                    </View>
                    <Text style={styles.tagline}>{this.state.tagline}</Text>
                    <Text style={styles.genres}>
                    {
                        this.state.genres.join(' | ')
                    }
                    </Text>
                    <TouchableOpacity style={styles.wishListBtn}><Text>Add to Wish-list</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.watchedListBtn}><Text>Add to Watched-list</Text></TouchableOpacity>
                    {
                        new Date(this.state.releaseDate) > new Date() ?
                            <Text style={styles.releaseDate}>
                                Releases 
                                {' ' + this.monthNames[new Date(this.state.releaseDate).getMonth()]}
                                {' ' + this.state.releaseDate.slice(-2)}, {' ' + this.state.releaseDate.slice(0, 4)}
                            </Text> :
                            <Text style={styles.releaseDate}>
                                Released 
                                {' ' + this.monthNames[new Date(this.state.releaseDate).getMonth()]}
                                {' ' + this.state.releaseDate.slice(-2)}, {' ' + this.state.releaseDate.slice(0, 4)}
                            </Text>
                    }
                    <Text style={styles.text}>{this.state.overview}</Text>
                    <Image source={{uri: this.state.backdropPath}}
                        style={styles.backdropPath}
                        resizeMode="contain"/>
                </View>
                <ScrollView horizontal={true}>
                    {/* TODO Credit Profile */}
                </ScrollView>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 25,
        backgroundColor: '#fafafa',
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
        borderRadius: 2,
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
        width: '50%',
        marginBottom: 10,
        backgroundColor: '#7befb2',
    },
    watchedListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
		borderRadius: 50,
		padding: 15,
        width: '50%',
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
    },
});
