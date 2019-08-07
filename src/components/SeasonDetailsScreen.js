import React, {Component} from 'react';
import { 
	Text,
	View,
	ScrollView,
	StyleSheet,
	Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class SeasonDetailsScreen extends Component {
	static navigationOptions = ({navigation}) => {
		this.title = navigation.getParam('seasonName', 'Season Details') + ' : ' + navigation.getParam('showName', '');

		return {
			title: this.title,
		};
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			posterPath: '',
			seasonNo: '',
			airDate: '',
			episodes: [],
			episodeAirDates: [],
			episodeNames: [],
			episodeOverviews: [],
			episodeVoteAverages: [],
			episodeVoteCounts: [],
		};
        this.noPoster = false;
		this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
		this.titleId = this.props.navigation.getParam('titleId', 1399);
		this.seasonNo = this.props.navigation.getParam('seasonNo', 1);
		this.seasonName = this.props.navigation.getParam('seasonName', 'Season Details');
		this.showName = this.props.navigation.getParam('showName', '');
		this.fetchSeasonDetails(this.titleId, this.seasonNo);
	}

	fetchSeasonDetails = (titleId, seasonNo) => {
		fetch(`https://api-cine-digest.herokuapp.com/api/v1/gets/${titleId}/${seasonNo}`)
			.then(response => response.json())
			.then(jsonResponse => {
				this.episodes = [];
				this.episodeAirDates = [];
				this.episodeNames = [];
				this.episodeOverviews = [];
				this.episodeVoteAverages = [];
				this.episodeVoteCounts = [];
				this.noPoster = jsonResponse.poster_path !== null ? false : true;
				for (let i = 0; i < jsonResponse.episodes.length; ++i) {
					this.episodes.push(jsonResponse.episodes[i].episode_number);
					this.episodeAirDates.push(jsonResponse.episodes[i].air_date);
					this.episodeNames.push(jsonResponse.episodes[i].name);
					this.episodeOverviews.push(jsonResponse.episodes[i].overview);
					this.episodeVoteAverages.push(jsonResponse.episodes[i].vote_average);
					this.episodeVoteCounts.push(jsonResponse.episodes[i].vote_count);
				}
				this.setState(
					{
						posterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
						seasonNo: jsonResponse.season_number,
						airDate: jsonResponse.air_date,
						episodes: this.episodes,
						episodeAirDates: this.episodeAirDates,
						episodeNames: this.episodeNames,
						episodeOverviews: this.episodeOverviews,
						episodeVoteAverages: this.episodeVoteAverages,
						episodeVoteCounts: this.episodeVoteCounts,
					}
				);

			});
	};

	render() {
		let posterJsx = this.noPoster === false ?
            <Image source={{uri: this.state.posterPath}}
                style={styles.posterPath}
				resizeMode="contain"/> : null;

		let seasonNameJsx = this.seasonName !== null ?
			<Text style={styles.seasonName}>
				{this.seasonName}
			</Text> : null;

		let showNameJsx = this.showName !== '' ?
			<Text style={styles.showName}>
				{this.showName}
			</Text> : null;

		let airDateJsx = this.state.airDate !== null ?
			<Text style={styles.text}>
				Aired on
				{' ' + this.monthNames[new Date(this.state.airDate).getMonth()]}
				{' ' + this.state.airDate.slice(-2)}, {' ' + this.state.airDate.slice(0, 4)}
			</Text> : null;

		let episodesJsx = [];

		for (let i = 0; i < this.state.episodes.length; ++i) {
			episodesJsx.push(
				<View style={styles.episodeContainer}>
					<Text style={styles.episodeNumber}>
						Episode {i + 1}
					</Text>
					{
						this.state.episodeNames[i] !== null ?
						<Text style={styles.episodeHeader}>
							{this.state.episodeNames[i]}
						</Text> : null
					}
					{
						this.state.episodeAirDates[i] !== null ?
						<Text style={styles.text}>
							Aired on
							{' ' + this.monthNames[new Date(this.state.episodeAirDates[i]).getMonth()]}
							{' ' + this.state.episodeAirDates[i].slice(-2)}, {' ' + this.state.episodeAirDates[i].slice(0, 4)}
						</Text> : null
					}
					{
						this.state.episodeOverviews[i] !== null ?
						<Text style={styles.overview}>
							{this.state.episodeOverviews[i]}
						</Text> : null
					}
					{
						<View style={styles.voteWrapper}>
							<Text style={styles.text}>{this.state.episodeVoteAverages[i]}</Text>
							<Icon name="heart" size={15} color="#db0a5b" style={styles.heartIcon}/>
							<Text style={styles.text}>by {this.state.episodeVoteCounts[i]} {this.state.episodeVoteCounts[i] > 1 ? 'people' : 'person'}</Text>
						</View>
					}
				</View>
			);
		}

		return (
			<ScrollView style={styles.container}>
				<ScrollView>
					<View style={styles.seasonContainer}>
						{posterJsx}
						{seasonNameJsx}
						{showNameJsx}
						{airDateJsx}
					</View>
				</ScrollView>

				<ScrollView horizontal={true}>
					{episodesJsx}
				</ScrollView>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create(
{
	container: {
		backgroundColor: '#f2f1ef',
		height: '100%',
		flex: 1,
		padding: 10,
		flexDirection: 'column',
	},
    seasonContainer: {
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
	episodeContainer: {
		margin: 10,
		marginBottom: 20,
		padding: 25,
        backgroundColor: '#fefefa',
        borderRadius: 15,
		width: 400,
        flexDirection: 'column',
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
	seasonName: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	showName: {
		fontSize: 18,
		marginBottom: 15,
	},
	episodeHeader: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	episodeNumber: {
		fontSize: 16,
		marginBottom: 10,
	},
	overview: {
		fontSize: 15,
		textAlign: 'justify',
		marginBottom: 10,
	},
	text: {
		fontSize: 15,
		marginBottom: 10,
	},
	voteWrapper: {
        flexDirection: 'row',
		alignSelf: 'flex-end',
		alignItems: 'flex-end',
		flex: 1,
    },
    heartIcon: {
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 13,
    },
});
