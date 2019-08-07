import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class ShowDetailsScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('screenName', 'Show Details'),
        };
    }
    constructor(props) {
        super(props);
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        this.state = {
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
        };
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
                        // Unused
                        // budget: jsonResponse.budget,
                        // revenue: jsonResponse.revenue,
                        // homepage: jsonResponse.homepage,
                        overview: jsonResponse.overview,
                        posterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
                    });
                }) // TODO fix response status parsing
                .catch(error => {
                    // alert('Oops!\nPlease make sure your search query is correct!');
                });
        }
    }

    render() {
        this.titleId = this.props.navigation.getParam('titleId', 'null');
        this.fetchShowDetails(this.titleId);
        let posterJsx = this.state.posterPath !== null ?
            <Image source={{uri: this.state.posterPath}}
                style={styles.posterPath}
                resizeMode="contain"/> : '';
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
        let backdropPathJsx = this.state.backdropPath !== null ?
            <Image source={{uri: this.state.backdropPath}}
                style={styles.backdropPath}
                resizeMode="contain"/> : null;
        let seasonsJsx = [];
        for (let i = 0; i < this.state.seasons.length; ++i) {
            seasonsJsx.push(
                <TouchableOpacity style={styles.seasonWrapper}>
                    <Text style={styles.text}>{this.state.seasons[i]}</Text>
                    <Icon name="angle-right" size={20} color="#19b5fe" style={styles.rightIcon}/>
                </TouchableOpacity>
            )
        }
        return (
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
                    <TouchableOpacity style={styles.wishListBtn}><Text>Add to Wish-list</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.watchedListBtn}><Text>Add to Watched-list</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.watchingListBtn}><Text>Add to Watching-list</Text></TouchableOpacity>
                    <View style={styles.airDateWrapper}>
                        {firstAirDateJsx}
                        {lastAirDateJsx}
                    </View>
                    {overviewJsx}
                    {backdropPathJsx}
                    {seasonsJsx}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#f2f1ef',
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
    createdBy: {
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
        marginBottom: 10,
    },
    watchingListBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
		borderRadius: 50,
		padding: 15,
        width: '50%',
        backgroundColor: '#f5e51b',
        marginBottom: 30,
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
        borderWidth: 0.1,
        borderRadius: 50,
        padding: 20,
        marginBottom: 10,
    },
    rightIcon: {
        marginLeft: 20,
    },
});
