import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
} from 'react-native';


import FullListContainer from './FullListContainer';
import db from '../db/db';

export default class FullListScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const titleType = navigation.getParam('titleType') === 'movie' ? 'Movie\'s' : 'Show\'s';
        let listType = '';
        switch (navigation.getParam('listType')) {
            case 'wishList':
                listType = 'Wish List';
                break;
            case 'watchedList':
                listType = 'Watched List';
                break;
            case 'watchingList':
                listType = 'Watching List';
                break;
            default:
                listType = 'List';
        }
        return {
            title: titleType + ' ' + listType,
        };
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            isEmpty: true,
            titleType: '',
            listType: '',
            username: '',
            listLength: '',
            wishList: {
                titleIds: [],
                titles: [],
                overviews: [],
                posterPaths: [],
                voteAverages: [],
                voteCounts: [],
            },
            watchingList: {
                titleIds: [],
                titles: [],
                overviews: [],
                posterPaths: [],
                voteAverages: [],
                voteCounts: [],
            },
            watchedList: {
                titleIds: [],
                titles: [],
                overviews: [],
                posterPaths: [],
                voteAverages: [],
                voteCounts: [],
            },
        };

        this.initState = () => {
            return new Promise((resolve, reject) => {
                const listType = this.props.navigation.getParam('listType', null);
                const titleType = this.props.navigation.getParam('titleType', null);
                const username = this.props.navigation.getParam('username', null);
                this.setState({
                    username,
                    listType,
                    titleType,
                });
                resolve(true);
            });
        };

        this.initList = () => {
            return new Promise((resolve, reject) => {
                const {
                    listType,
                    titleType,
                    username,
                } = this.state;

                db.getHistory(username, listType, titleType)
                    .then(result => {
                        let len = result.length;
                        let titleIds = [];
                        let titles = [];
                        let voteCounts = [];
                        let voteAverages = [];
                        let posterPaths = [];
                        let partialOverviews = [];

                        if (len > 0) {
                            // If atleast one movie is listed in watchedList display it
                            for (let i = len - 1; i >= 0; i--) {
                                titleIds.push(result[i].titleId);
                                titles.push(result[i].titleName);

                                let fullOverview = result[i].titleOverview;
                                // Limit overview to 150 characters or less

                                let partialOverview = fullOverview.length <= 100 ? fullOverview :
                                    fullOverview.slice(0, 150) + '...';

                                partialOverviews.push(partialOverview);
                                voteCounts.push(result[i].titleVoteCount);
                                voteAverages.push(result[i].titleVoteAverage);
                                posterPaths.push(result[i].titlePosterPath);
                            }

                            // Set latest addition to state
                            this.setState({
                                isEmpty: false,
                                [listType]: {
                                    titleIds,
                                    titles,
                                    overviews: partialOverviews,
                                    voteCounts,
                                    voteAverages,
                                    posterPaths,
                                },
                                listLength: len,
                            });
                            // console.warn('poster in screen ' + this.state.wishList.posterPaths[0]);
                            resolve(true);
                        }
                        resolve(true);
                    });
            });
        }
    }

    onIdSelected = (itemId, itemTitle) => {
        this.state.titleType === 'movie' ?
            this.props.navigation.navigate('MovieDetailsScreen', {
                titleId: itemId,
                screenName: itemTitle,
                username: this.state.username,
            }) :
            this.props.navigation.navigate('ShowDetailsScreen', {
                screenName: itemTitle,
                titleId: itemId,
                username: this.state.username,
            });
    };

    componentDidMount() {
        this.initState()
        .then(() => this.initList())
        .catch(error => alert(error.message));
    }

    render() {
        let listContainerJsx = '';
        switch (this.state.listType) {
            case 'wishList':
                listContainerJsx =
                    <FullListContainer
                        source={this.state.wishList}
                        sourceLength={this.state.listLength}
                        onIdSelected={this.onIdSelected}
                    />;
                break;
            case 'watchingList':
                listContainerJsx =
                    <FullListContainer
                        source={this.state.watchingList}
                        sourceLength={this.state.listLength}
                        onIdSelected={this.onIdSelected}
                    />;
                break;
            case 'watchedList':
                listContainerJsx =
                    <FullListContainer
                        source={this.state.watchedList}
                        sourceLength={this.state.listLength}
                        onIdSelected={this.onIdSelected}
                    />;
                break;
            default:
                listContainerJsx = null;
        }
        console.warn('From screen: listLength new: ' + this.state.listLength)
        if (!this.state.isEmpty) {
            return (
                <ImageBackground blurRadius={1.3}
                    source={require('../assets/lilypads.png')}
                    resizeMode="cover" style={styles.bgImage}>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.container}>
                           {listContainerJsx}
                        </View>
                    </ScrollView>
                </ImageBackground>
            );
        } else {
            return (
                <ImageBackground blurRadius={1.3}
                    source={require('../assets/lilypads.png')}
                    resizeMode="cover" style={styles.bgImage}>
                    <View style={styles.indicatorContainer}>
                        <ActivityIndicator size="large" color="#22a7f0" />
                    </View>
                </ImageBackground>
            );
        }
    }
}
const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    indicatorContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});