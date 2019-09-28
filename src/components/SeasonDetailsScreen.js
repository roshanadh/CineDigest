import React, {Component} from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	Image,
	ImageBackground,
	ActivityIndicator,
	Alert,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from '@react-native-community/datetimepicker';
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
			date: null,
			maximumDate: null,
			showDate: false,
			posterPath: '',
			originalPosterPath: '',
			seasonNo: '',
			airDate: '',
			episodes: [],
			episodeAirDates: [],
			episodeNames: [],
			episodeOverviews: [],
			episodeVoteAverages: [],
			episodeVoteCounts: [],
			contentJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
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
			let lowResPosterPath = `https://image.tmdb.org/t/p/w185/${this.state.posterPath}`;
			let posterJsx = this.noPoster === false ?
				<View>
					<ImageBackground source={{ uri: lowResPosterPath }}
						blurRadius={10} style={styles.containerPoster}
						resizeMode="cover">
						<Image source={{ uri: this.state.originalPosterPath }}
							style={styles.originalPoster}
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
									<View style={styles.airDateWrapper}>
										<Text style={styles.airDate}>
											Airs on
											{' ' + this.monthNames[new Date(this.state.episodeAirDates[i]).getMonth()]}
											{' ' + this.state.episodeAirDates[i].slice(-2)}, {' ' + this.state.episodeAirDates[i].slice(0, 4)}
										</Text>
										<Icon name="bell-o" size={20}
											color="#db0a5b"
											style={styles.notifyIcon}
											onPress={() => {
												console.warn('Ok you will be notified!');
												this.setState({ showDate: true },
													() => {
														console.warn(this.state.showDate + ' is showDate!');
													});
											}} />
									</View>
									:
									<View style={styles.airDateWrapper}>
										<Text style={styles.airDate}>
											Aired on
									{' ' + this.monthNames[new Date(this.state.episodeAirDates[i]).getMonth()]}
											{' ' + this.state.episodeAirDates[i].slice(-2)}, {' ' + this.state.episodeAirDates[i].slice(0, 4)}
										</Text>
										<Icon name="bell-o" size={20}
											color="#db0a5b"
											style={styles.notifyIcon}
											onPress={() => {
												console.warn('Ok you will be notified!');
												this.setState({ showDate: true },
													() => {
														console.warn(this.state.showDate + ' is showDate!');
													});
											}} />
									</View>
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
					contentJsx: <ActivityIndicator size="large" color="#674172" style={styles.indicator} />,
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
								posterPath: jsonResponse.poster_path,
								originalPosterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.poster_path}`,
								seasonNo: jsonResponse.season_number,
								airDate: jsonResponse.air_date,
								episodes: this.episodes,
								episodeAirDates: this.episodeAirDates,
								episodeNames: this.episodeNames,
								episodeOverviews: this.episodeOverviews,
								episodeVoteAverages: this.episodeVoteAverages,
								episodeVoteCounts: this.episodeVoteCounts,
							}, () => {
									this.initScreen();
									resolve(true);
							});
						});
				});
			});
		};

		this.initDate = () => {
			const dateObj = new Date();
			const currentYear = dateObj.getFullYear().toString();
			const currentMonth =
				(dateObj.getMonth() + 1).toString().length < 2 ?
					'0' + (dateObj.getMonth() + 1).toString() :
					(dateObj.getMonth() + 1).toString();
			const currentDate = dateObj.getDate().toString();
			const currentFullDate = currentYear + '-' + currentMonth + '-' + currentDate;
			this.setState({ date: new Date(currentFullDate) });
		};

		this.setDate = (event, date, title) => {
			const notifyYear = date.getFullYear();
			const notifyMonth = date.getMonth();
			const notifyDay = date.getDate();
			const notifyDate = {
				notifyYear,
				notifyMonth,
				notifyDay,
			};
			this.setState({
				showDate: false,
			});
			this.scheduleNotif(title, notifyDate);
		};

		this.scheduleNotif = (title, notifyDate) => {
            /*
                * For scheduling notifications
            */
			const {
				notifyYear,
				notifyMonth,
				notifyDay,
			} = notifyDate;
			const notifId = Math.floor(Math.random() * 36).toString();
			PushNotification.localNotificationSchedule({
				/* Android Only Properties */
				id: notifId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
				ticker: 'My Notification Ticker', // (optional)
				autoCancel: true, // (optional) default: true
				largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
				smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
				bigText: 'A new episode of ' + title + ' will be airing soon. Make sure you\'ve got your snacks ready! ', // (optional) default: "message" prop
				subText: title, // (optional) default: none
				// color: "red", // (optional) default: system default
				vibrate: true, // (optional) default: true
				// vibration: 1000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
				tag: 'some_tag', // (optional) add tag to message
				group: 'group', // (optional) add group to message
				ongoing: false, // (optional) set whether this is an "ongoing" notification
				priority: 'high', // (optional) set notification priority, default: high
				visibility: 'private', // (optional) set notification visibility, default: private
				importance: 'high', // (optional) set notification importance, default: high


				/* iOS and Android properties */
				title: title + ' is airing soon!', // (optional)
				message: 'Make sure you don\'t miss it!',
				playSound: true, // (optional) default: true
				soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
				number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
				repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
				actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
				date: new Date(new Date(notifyYear, notifyMonth, notifyDay, 6, 20, 0).getTime()),
			});
			Alert.alert(
				'Notification Scheduled!',
				'You will be notified on '
				+ (parseInt(notifyMonth, 10) + 1)
				+ '/' + notifyDay
				+ ' at 6:20 AM',
				[
					{ text: 'UNDO', onPress: () => PushNotification.cancelLocalNotifications({ id: notifId }) },
					{ text: 'OK', onPress: () => console.log('OK Pressed') },
				],
				{ cancelable: false },
			);
		};
	}

	componentDidMount() {
		this.initDate();
		this.fetchSeasonDetails(this.titleId, this.seasonNo)
			.catch(error => console.warn(error));
	}

	render() {
		const { showDate, date, maximumDate } = this.state;
		return (
			<ImageBackground blurRadius={2}
				source={require('../assets/lilypads.png')}
				resizeMode="cover" style={styles.bgImage}>
				{this.state.contentJsx}
				{showDate &&
					<DateTimePicker
						value={date}
						maximumDate={maximumDate}
						minimumDate={date}
						mode="date"
						display="default"
						onChange={(event, date) => this.setDate(event, date, this.showName)}
					/>
				}
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
	originalPoster: {
        width: 400,
        height: 400,
        alignSelf: 'center',
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
	airDateWrapper: {
		flexDirection: 'row',
	},
	airDate: {
		fontSize: 15,
		marginBottom: 10,
	},
	notifyIcon: {
		marginLeft: 20,
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
