import React, {Component} from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	Image,
	ImageBackground,
	ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class SeasonDetailsScreen extends Component {
	static navigationOptions = ({navigation}) => {
		this.title = navigation.getParam('seasonName', 'Season Details') + ' : ' + navigation.getParam('showName', '');
		return {
			title: this.title,
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
			contentJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
		};
        this.noPoster = false;
		this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
		this.titleId = this.props.navigation.getParam('titleId', 1399);
		this.seasonNo = this.props.navigation.getParam('seasonNo', 1);
		this.seasonName = this.props.navigation.getParam('seasonName', 'Season Details');
		this.showName = this.props.navigation.getParam('showName', '');

		this.initScreen = () => {
			let posterJsx = this.noPoster === false ?
				<View>
					<ImageBackground source={{ uri: this.state.posterPath }}
						blurRadius={10} style={styles.containerPoster}
						resizeMode="cover">
						<Image source={{ uri: this.state.posterPath }}
							style={styles.posterPath}
							resizeMode="contain" />
					</ImageBackground>
				</View>
				: null;

			let seasonNameJsx = this.seasonName !== null ?
				<Text style={styles.seasonName}>
					{this.seasonName}
				</Text> : null;

			let showNameJsx = this.showName !== '' ?
				<Text style={styles.showName}>
					{this.showName}
				</Text> : null;

			let airDateJsx = this.state.airDate !== '' ?
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
								(new Date(this.state.episodeAirDates[i]) > new Date() ?
									<Text style={styles.airDate}>
										Airs on
									{' ' + this.monthNames[new Date(this.state.episodeAirDates[i]).getMonth()]}
										{' ' + this.state.episodeAirDates[i].slice(-2)}, {' ' + this.state.episodeAirDates[i].slice(0, 4)}
									</Text> :
									<Text style={styles.airDate}>
										Aired on
									{' ' + this.monthNames[new Date(this.state.episodeAirDates[i]).getMonth()]}
										{' ' + this.state.episodeAirDates[i].slice(-2)}, {' ' + this.state.episodeAirDates[i].slice(0, 4)}
									</Text>
								) : null
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
								<Icon name="heart" size={15} color="#db0a5b" style={styles.heartIcon} />
								<Text style={styles.text}>by {this.state.episodeVoteCounts[i]} {this.state.episodeVoteCounts[i] > 1 ? 'people' : 'person'}</Text>
							</View>
						}
					</View>
				);
			}

			let seasonContainerWithoutPosterJsx =
				<View style={styles.seasonContainerWithoutPoster}>
					{seasonNameJsx}
					{showNameJsx}
					{airDateJsx}
				</View>;

			let contentJsx =
				<ScrollView style={styles.container}>
					<ScrollView>
						<View style={styles.seasonContainer}>
							{posterJsx}
							{seasonContainerWithoutPosterJsx}
						</View>
					</ScrollView>
					<ScrollView horizontal={true}>
						{episodesJsx}
					</ScrollView>
				</ScrollView>;
			this.setState({ contentJsx });
		};

		this.fetchSeasonDetails = (titleId, seasonNo) => {
			return new Promise((resolve, reject) => {
				this.setState({
					contentJsx: <ActivityIndicator size="large" color="#22a7f0" style={styles.indicator} />,
				}, () => {
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
							this.setState({
								posterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
								seasonNo: jsonResponse.season_number,
								airDate: jsonResponse.air_date,
								episodes: this.episodes,
								episodeAirDates: this.episodeAirDates,
								episodeNames: this.episodeNames,
								episodeOverviews: this.episodeOverviews,
								episodeVoteAverages: this.episodeVoteAverages,
								episodeVoteCounts: this.episodeVoteCounts,
							});
							this.initScreen()
								.then(() => resolve(true))
								.catch(error => reject(error));
						});
				});
			});
		};
	}

	componentDidMount() {
		this.fetchSeasonDetails(this.titleId, this.seasonNo)
			.catch(error => console.warn(error));
	}

	render() {
		return (
			<ImageBackground blurRadius={1.5}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				{this.state.contentJsx}
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create(
{
	bgImage: {
		width: '100%',
		height: '100%',
		flex: 1,
	},
	container: {
		height: '100%',
		flex: 1,
		// padding: 10,
		flexDirection: 'column',
	},
	seasonContainerWithoutPoster: {
		padding: 25,
		minWidth: '95%',
		flexDirection: 'column',
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	episodeContainer: {
		margin: 10,
		marginLeft: 10,
		marginBottom: 20,
		padding: 25,
		backgroundColor: '#fff',
		width: 300,
        flexDirection: 'column',
        justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	containerPoster: {
		width: '100%',
		height: 400,
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
	airDate: {
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
	indicator: {
		flex: 1,
		alignSelf: 'center',
		margin: 20,
	},
});
