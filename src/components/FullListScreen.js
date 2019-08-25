import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    RefreshControl,
    Alert,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import FullListContainer from './FullListContainer';
import db from '../db/db';
import netCon from '../util/NetCon';

export default class FullListScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const titleType = navigation.getParam('titleType') === 'movie' ? 'Movies\'' : 'Shows\'';
        let listTypeForHeader = '';
        switch (navigation.getParam('listType')) {
            case 'wishList':
                listTypeForHeader = 'Wish List';
                break;
            case 'watchedList':
                listTypeForHeader = 'Watched List';
                break;
            case 'watchingList':
                listTypeForHeader = 'Watching List';
                break;
            default:
                listTypeForHeader = 'List';
        }
        return {
            title: titleType + ' ' + listTypeForHeader,
            headerTitleStyle: {
                color: '#fefefe',
            },
            headerTintColor: '#fefefe',
            headerStyle: {
                backgroundColor: '#6bb9f0',
                elevation: 0,
            },
            headerRight: (
                <Icon name="delete"
                    style={styles.trashIcon}
                    size={28}
                    onPress={() => {
                        let username = navigation.getParam('username', null);
                        let listType = navigation.getParam('listType', null);
                        let titleType = navigation.getParam('titleType', null);
                        db.deleteAllListItems(username, listType, titleType)
                            .then((result) => {
                                Alert.alert('Success', `Your ${listTypeForHeader} has been cleared!`);
                            }, (error) => Alert.alert('Oops', 'Please try again!'));
                    }} />
            ),
        };
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            isEmpty: true,
            refreshing: false,
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
            listContainerJsx: '',
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
                            // If atleast one title is listed in watchedList display it
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

                            let list = {
                                titleIds,
                                titles,
                                overviews: partialOverviews,
                                voteCounts,
                                voteAverages,
                                posterPaths,
                            };

                            // Set listContainerJsx
                            let listContainerJsx = '';
                            switch (this.state.listType) {
                                case 'wishList':
                                    listContainerJsx =
                                        <FullListContainer
                                            source={list}
                                            sourceLength={len}
                                            onIdSelected={this.onIdSelected}
                                            listType={this.state.listType}
                                        />;
                                    break;
                                case 'watchingList':
                                    listContainerJsx =
                                        <FullListContainer
                                            source={list}
                                            sourceLength={len}
                                            onIdSelected={this.onIdSelected}
                                            listType={this.state.listType}
                                        />;
                                    break;
                                case 'watchedList':
                                    listContainerJsx =
                                        <FullListContainer
                                            source={list}
                                            sourceLength={len}
                                            onIdSelected={this.onIdSelected}
                                            listType={this.state.listType}
                                        />;
                                    break;
                                default:
                                    listContainerJsx = '';
                            }

                            // Set latest addition to state
                            this.setState({
                                isEmpty: false,
                                refreshing: false,
                                [listType]: {
                                    titleIds,
                                    titles,
                                    overviews: partialOverviews,
                                    voteCounts,
                                    voteAverages,
                                    posterPaths,
                                },
                                listLength: len,
                                listContainerJsx,
                            });
                            resolve(true);
                        } else {
                            // The list is empty
                            let listName = '';
                            switch (this.state.listType) {
                                case 'wishList':
                                    listName = 'Wish List';
                                    break;
                                case 'watchingList':
                                    listName = 'Watching List';
                                    break;
                                case 'watchedList':
                                    listName = 'Watched List';
                                    break;
                                default:
                                    null;
                            }

                            Snackbar.show({
                                title: `${listName} is empty!`,
                                duration: Snackbar.LENGTH_LONG,
                                action: {
                                    title: 'OK',
                                    color: '#fefefe',
                                    onPress: () => { },
                                },
                                color: '#fefefe',
                                fontSize: 16,
                                backgroundColor: '#e74c3c',
                            });
                            this.props.navigation.goBack();
                        }
                        resolve(true);
                    });
            });
        };
    }

    onIdSelected = (itemId, itemTitle) => {
        netCon.checkNetCon()
            .then((result) => {
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
            }, (error) => {
                netCon.showSnackBar('An internet connection is required!');
            });
    };

    _onRefresh = () => {
        this.setState({
            refreshing: true,
            listContainerJsx: <View />,
        });

        this.initList()
            .then(() => {
                this.setState({refreshing: false});
            });
    }

    componentDidMount() {
        this.initState()
            .then(() => this.initList())
            .catch(error => alert(error.message));
    }

    render() {
        if (!this.state.isEmpty) {
            return (
                <ImageBackground blurRadius={1.3}
                    source={require('../assets/lilypads.png')}
                    resizeMode="cover" style={styles.bgImage}>
                    <ScrollView style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />}>
                        <View style={styles.container}>
                            {this.state.listContainerJsx}
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
    trashIcon: {
        color: '#c0392b',
        marginRight: 30,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    indicatorContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        alignSelf: 'center',
    },
});
